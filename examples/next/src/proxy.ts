import { NextRequest, NextResponse } from "next/server";
import { auditauth } from '@/providers/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/private')) {
    return auditauth.middleware(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

