import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

// ─────────────────────────────────────────────────────────────
// PUBLIC ROUTES
// Accessible with or without login
// ─────────────────────────────────────────────────────────────

const PUBLIC_ROUTES = [
  "/",
  "/jobs",
  "/companies",
  "/signin",
  "/signup",
  "/forget-password",
  "/reset-password",
] as const;

// ─────────────────────────────────────────────────────────────
// AUTH ONLY ROUTES
// Logged in users should NOT access these
// ─────────────────────────────────────────────────────────────

const AUTH_ONLY_ROUTES = [
  "/signin",
  "/signup",
  "/forget-password",
  "/reset-password",
] as const;

// ─────────────────────────────────────────────────────────────
// ROLE BASED ROUTES
// ─────────────────────────────────────────────────────────────

const ROLE_ROUTES: Record<string, string[]> = {
  CANDIDATE: [
    "/jobs",
    "/companies",
    "/selectrole",
    "/messages",
    "/network",
    "/setting",
    "/subscriptions",
    "/userProfile",
    "/dashboard",
    "/dashboard/jobStatus",
  ],

  RECRUITER: [
    "/jobs",
    "/companies",
    "/selectrole",
    "/messages",
    "/network",
    "/setting",
    "/subscriptions",
    "/userProfile",
    "/createJob",
    "/dashboard",
    "/dashboard/jobStatus",
  ],

  ORGANIZATION: [
    "/jobs",
    "/companies",
    "/selectrole",
    "/messages",
    "/network",
    "/setting",
    "/subscriptions",
    "/userProfile",
    "/createJob",
    "/dashboard",
    "/dashboard/employer/job",
    "/dashboard/employer/jobs",
    "/dashboard/employees",
  ],
};

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function isPathMatch(pathname: string, route: string): boolean {
  return (
    pathname === route ||
    pathname.startsWith(`${route}/`)
  );
}

function isPublicPath(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) =>
    isPathMatch(pathname, route)
  );
}

function isAuthOnlyPath(pathname: string): boolean {
  return AUTH_ONLY_ROUTES.some((route) =>
    isPathMatch(pathname, route)
  );
}

function hasRoleAccess(
  pathname: string,
  role: string
): boolean {
  const allowedRoutes = ROLE_ROUTES[role] || [];

  return allowedRoutes.some((route) =>
    isPathMatch(pathname, route)
  );
}

function redirect(
  req: NextRequestWithAuth,
  path: string
) {
  return NextResponse.redirect(
    new URL(path, req.url)
  );
}

// ─────────────────────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────────────────────

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;

    const token = req.nextauth.token;

    const isLoggedIn = !!token;

    const role =
      (token?.user as any)?.role ?? null;

    // ─────────────────────────────────────────
    // Skip Next.js internals
    // ─────────────────────────────────────────

    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.includes(".")
    ) {
      return NextResponse.next();
    }

    // ─────────────────────────────────────────
    // NOT LOGGED IN USERS
    // ─────────────────────────────────────────

    if (!isLoggedIn) {
      // allow public pages
      if (isPublicPath(pathname)) {
        return NextResponse.next();
      }

      // protected page -> signin
      return redirect(req, "/signin");
    }

    // ─────────────────────────────────────────
    // LOGGED IN USERS CANNOT ACCESS
    // AUTH PAGES
    // ─────────────────────────────────────────

    if (isAuthOnlyPath(pathname)) {
      return redirect(req, "/dashboard");
    }

    // ─────────────────────────────────────────
    // USER HAS NO ROLE
    // ─────────────────────────────────────────

    if (!role) {
      // only allow selectrole
      if (pathname === "/selectrole") {
        return NextResponse.next();
      }

      return redirect(req, "/selectrole");
    }

    // ─────────────────────────────────────────
    // PUBLIC ROUTES STILL ALLOWED
    // ─────────────────────────────────────────

    if (isPublicPath(pathname)) {
      return NextResponse.next();
    }

    // ─────────────────────────────────────────
    // ROLE ACCESS CONTROL
    // ─────────────────────────────────────────

    const hasAccess = hasRoleAccess(
      pathname,
      role
    );

    if (!hasAccess) {
      // invalid role
      if (!ROLE_ROUTES[role]) {
        return redirect(req, "/signin");
      }

      // access denied
      return redirect(req, "/dashboard");
    }

    // ─────────────────────────────────────────
    // ALLOW ACCESS
    // ─────────────────────────────────────────

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },

    pages: {
      signIn: "/signin",
    },
  }
);

// ─────────────────────────────────────────────────────────────
// MATCHER
// ─────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - api
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - files (png, jpg, svg, etc)
     */

    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};