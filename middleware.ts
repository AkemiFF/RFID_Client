// If this file exists, check if it's affecting your notifications route
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  console.log("Middleware intercepting:", request.nextUrl.pathname)
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

