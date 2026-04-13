import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionValue,
  getAdminSessionTtlSeconds,
  isAdminSecurityConfigured,
  validateAdminCredentials,
} from "@/lib/admin-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  getClientAddress,
  hasTrustedOrigin,
  isPayloadTooLarge,
} from "@/lib/request-security";

export async function POST(request: Request) {
  if (!hasTrustedOrigin(request)) {
    return NextResponse.redirect(new URL("/admin?error=blocked", request.url), 303);
  }

  if (!isAdminSecurityConfigured()) {
    return NextResponse.redirect(new URL("/admin?error=setup", request.url), 303);
  }

  if (isPayloadTooLarge(request, 4_096)) {
    return NextResponse.redirect(new URL("/admin?error=blocked", request.url), 303);
  }

  const rateLimit = checkRateLimit({
    key: `admin-login:${getClientAddress(request)}`,
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.redirect(new URL("/admin?error=rate-limit", request.url), 303);
  }

  const formData = await request.formData();
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (username.length > 80 || password.length > 120) {
    return NextResponse.redirect(new URL("/admin?error=invalid", request.url), 303);
  }

  if (!validateAdminCredentials(username, password)) {
    return NextResponse.redirect(new URL("/admin?error=invalid", request.url), 303);
  }

  const response = NextResponse.redirect(new URL("/admin", request.url), 303);

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: createAdminSessionValue(),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getAdminSessionTtlSeconds(),
    priority: "high",
  });

  response.headers.set("Cache-Control", "no-store");

  return response;
}
