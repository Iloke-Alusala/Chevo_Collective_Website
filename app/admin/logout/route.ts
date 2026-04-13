import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { hasTrustedOrigin } from "@/lib/request-security";

export async function POST(request: Request) {
  if (!hasTrustedOrigin(request)) {
    return NextResponse.redirect(new URL("/admin?error=blocked", request.url), 303);
  }

  const response = NextResponse.redirect(new URL("/admin", request.url), 303);

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    expires: new Date(0),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    priority: "high",
  });

  response.headers.set("Cache-Control", "no-store");

  return response;
}
