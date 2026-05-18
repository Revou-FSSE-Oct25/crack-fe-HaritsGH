import axios from 'axios';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/profile'];

  // Match dynamic routes that require admin access
  const isTournamentAdminRoute = /^\/tournament\/[^\/]+\/manage$/.test(pathname);

  // Match tournament routes that require authentication (but not necessarily admin)
  const isTournamentParticipateRoute = /^\/tournament\/[^\/]+\/participate$/.test(pathname);

  // Match static protected routes
  const isProtectedStaticRoute = protectedRoutes.some(route => pathname.startsWith(route));

  const isProtectedRoute = isTournamentAdminRoute || isTournamentParticipateRoute || isProtectedStaticRoute;

  // Get tokens from cookies
  const refreshToken = request.cookies.get('refreshToken')?.value
  const accessToken = request.cookies.get('accessToken')?.value

  // Redirect to dashboard if already logged in and accessing login page
  if (pathname === '/login' && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Non-protected routes
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Check if refresh token exists
  if (!refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Check tournament management access
  if (isTournamentAdminRoute) {
    try {
      const tournamentId = Number(pathname.split('/')[2]);

      const checkForAdmin = async () : Promise<number[]> => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/tournament/check-for-admin`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        return response.data.data.tournaments || [];
      }

      const adminTournaments = await checkForAdmin();

      if (!adminTournaments.includes(tournamentId)) {
        return NextResponse.redirect(new URL(`/tournament/${tournamentId}`, request.url))
      }
    } catch (error: any) {
      console.error('checkForAdmin error:', error.message);
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}
 
export const config = {
  matcher: [
    '/tournament/:id/participate',
    '/tournament/:id/manage',
    '/dashboard',
    '/profile/:path*',
    '/login',
  ],
}