import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = new Set([
  "/",
  "/jobs",
  "/companies",
  "/signin",
  "/signup",
  "/forget-password",
  "/reset-password",
]);

const AUTH_ROUTES = new Set([
  "/signin",
  "/signup",
  "/forget-password",
  "/reset-password",
]);

function isPathMatch(
  pathname: string,
  route: string
) {
  return (
    pathname === route ||
    pathname.startsWith(`${route}/`)
  );
}

function isPublicRoute(
  pathname: string
) {
  return [...PUBLIC_ROUTES].some(
    (route) =>
      isPathMatch(pathname, route)
  );
}

function isAuthRoute(
  pathname: string
) {
  return [...AUTH_ROUTES].some(
    (route) =>
      isPathMatch(pathname, route)
  );
}

function redirect(
  req: NextRequest,
  path: string
) {
  return NextResponse.redirect(
    new URL(path, req.url)
  );
}

export function middleware(
  req: NextRequest
) {
  const { pathname } =
    req.nextUrl;

  // Skip internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token =
    req.cookies.get(
      "next-auth.session-token"
    )?.value ||
    req.cookies.get(
      "__Secure-next-auth.session-token"
    )?.value;

  const isLoggedIn = !!token;

  // NOT LOGGED IN
  if (!isLoggedIn) {
    if (isPublicRoute(pathname)) {
      return NextResponse.next();
    }

    return redirect(req, "/signin");
  }

  // BLOCK AUTH PAGES
  if (isAuthRoute(pathname)) {
    return redirect(
      req,
      "/dashboard"
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};