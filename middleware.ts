import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // console.log('🔍 Middleware triggered for pathname:', pathname);
  
  // Use Next.js cookies API instead of manual parsing
  const cookie = request.cookies.get('auth-token');
  const token = cookie?.value || null;
  
  // console.log('🍪 Cookie exists:', !!cookie);
  // console.log('🎫 Token exists:', !!token);
  // console.log('🎫 Token value (first 20 chars):', token ? token.substring(0, 20) + '...' : 'null');

  // Protected routes
  const protectedRoutes = ['/register', '/dashboard'];
  const adminRoutes = ['/admin'];

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  
  // console.log('🛡️ Is protected route:', isProtectedRoute);
  // console.log('👑 Is admin route:', isAdminRoute);

  // If accessing protected route without token, redirect to login
  if ((isProtectedRoute || isAdminRoute) && !token) {
    // console.log('❌ No token found, redirecting to login');
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing admin route, verify token and check role
  if (isAdminRoute && token) {
    // console.log('🔐 Verifying token for admin route...');
    const payload = await verifyTokenEdge(token);
    // console.log('📦 Payload:', payload ? JSON.stringify(payload, null, 2) : 'null');
    // console.log('👤 Payload role:', payload?.role);
    // console.log('🔍 Role check (payload?.role !== "admin"):', payload?.role !== 'admin');
    
    if (!payload || payload.role !== 'admin') {
      console.log('❌ Admin access denied. Payload:', payload);
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    console.log('✅ Admin access granted');
  }

  // If accessing login/signup while authenticated, redirect to dashboard
  if ((pathname === '/login' || pathname === '/signup') && token) {
    console.log('🔄 Already authenticated, checking role for redirect...');
    const payload = await verifyTokenEdge(token);
    console.log('📦 Payload:', payload ? JSON.stringify(payload, null, 2) : 'null');
    if (payload) {
      if (payload.role === 'admin') {
        console.log('👑 Redirecting admin to admin dashboard');
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      console.log('👤 Redirecting user to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  console.log('✅ Middleware passed, allowing request');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/register/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
  ],
};

