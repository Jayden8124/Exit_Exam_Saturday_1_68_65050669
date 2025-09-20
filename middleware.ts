// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const userId = req.cookies.get("userId")?.value;

  // ถ้าไม่มี userId และจะเข้าเส้นทางด้านล่าง -> ส่งไปหน้า login
  if (
    !userId &&
    (req.nextUrl.pathname === "/" ||
      req.nextUrl.pathname.startsWith("/projects") ||
      req.nextUrl.pathname.startsWith("/stats"))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// ระบุเส้นทางที่จะตรวจสอบ
export const config = {
  matcher: ["/", "/projects/:path*", "/stats"],
};
