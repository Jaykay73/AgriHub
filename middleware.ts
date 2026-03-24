import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/farmer", "/buyer/orders", "/buyer/profile", "/checkout"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const uid = request.cookies.get("agrihub_uid")?.value;
  if (!uid) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/farmer/:path*", "/buyer/orders/:path*", "/buyer/profile/:path*", "/checkout/:path*"],
};
