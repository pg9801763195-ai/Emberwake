import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Edge proxy guard:
 * Intercepts any unauthenticated access to in-app routes
 * and redirects to the Gate ("/") with the target stored in ?next=.
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Never block auth endpoints, API routes, or public static assets
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  if (!req.auth) {
    const gate = new URL("/", req.nextUrl.origin);
    gate.searchParams.set("next", pathname);
    return NextResponse.redirect(gate);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/onboarding/:path*",
    "/camp/:path*",
    "/chronicle/:path*",
    "/merchant/:path*",
    "/relics/:path*",
    "/moments/:path*",
  ],
};
