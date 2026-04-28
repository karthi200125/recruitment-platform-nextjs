import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // 🟢 Allow select-role page always (avoid loop)
    if (pathname.startsWith("/select-role")) {
      return NextResponse.next();
    }

    const role = token?.user?.role;

    // 🚨 Logged in but no role → force select-role
    if (!role) {
      return NextResponse.redirect(new URL("/selectrole", req.url));
    }

    const isAllowed = (allowedRoles: string[]) =>
      allowedRoles.includes(role);

    // 🔒 Recruiter / Organization only
    if (pathname.startsWith("/createJob")) {
      if (!isAllowed(["RECRUITER", "ORGANIZATION"])) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // 🔒 Organization only
    if (pathname.startsWith("/dashboard/employees")) {
      if (!isAllowed(["ORGANIZATION"])) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // 🔒 Candidate / Recruiter only
    if (pathname.startsWith("/dashboard/jobStatus")) {
      if (!isAllowed(["CANDIDATE", "RECRUITER"])) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // only checks login
    },
    pages: {
      signIn: "/signin",
    },
  }
);

export const config = {
  matcher: [
    "/select-role",              // ✅ VERY IMPORTANT
    "/createJob/:path*",
    "/dashboard/:path*",
    "/messages/:path*",
    "/network/:path*",
    "/setting/:path*",
    "/subscription/:path*",
    "/userProfile/:path*",
  ],
};