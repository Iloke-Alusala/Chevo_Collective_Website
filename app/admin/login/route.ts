import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionValue,
  validateAdminCredentials,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!validateAdminCredentials(username, password)) {
    return NextResponse.redirect(new URL("/admin?error=invalid", request.url), 303);
  }

  const response = NextResponse.redirect(new URL("/admin", request.url), 303);

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: createAdminSessionValue(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}
