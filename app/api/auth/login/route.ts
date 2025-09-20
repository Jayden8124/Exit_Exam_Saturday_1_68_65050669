// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { UserModel } from "@/lib/models/UserModel";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const user = await UserModel.findByUsername(username);

  if (!user || user.password !== password) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  // ถ้า login ถูกต้อง -> set cookie
  const cookieStore = await cookies();
  cookieStore.set("userId", user.id, { httpOnly: false, path: "/" });

  // ⭐ เพิ่ม redirect ไปหน้า Home
  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set("userId", user.id, { httpOnly: false, path: "/" });
  return res;
}
