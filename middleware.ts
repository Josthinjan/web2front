import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Assume the cookie token is set when the user logs in successfully
  const cookieStore = cookies();
  console.log(cookieStore.get('token'));
  console.log(cookieStore.get('role'));
  
   if (!cookieStore.has('token')) {
     return NextResponse.redirect(new URL('/auth/login', request.url))
   }
  const response = NextResponse.next()


  return response;
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/core/(.*)',
}