import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Get auth user from cookie or session
  // For demo purposes, we're checking localStorage which is client-side only
  // In a real app, you'd check a secure session/JWT token from cookies

  // Admin routes - these will be protected on the client side since we can't access
  // localStorage in middleware. The ProtectedRoute component handles this.
  // Middleware for admin routes would need backend auth tokens.

  // For now, allow all routes to load. Client-side ProtectedRoute component
  // will handle redirects for protected pages.

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
