import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get role from cookie or localStorage - will be checked on client side
  // For server-side, we'd need to pass role in a cookie
  
  // Protect dashboard routes - redirect to login if not authenticated
  // and redirect to unauthorized if wrong role
  
  // Protected routes that need role-based access
  if (pathname.startsWith("/dashboard/technician") || pathname.startsWith("/dashboard/digital")) {
    // These will be protected by client-side logic in layout wrappers
    // since role info is in localStorage (client-side only)
    // In a production app, you'd store role in a secure HTTP-only cookie
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
