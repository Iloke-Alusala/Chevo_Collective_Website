import type { NextRequest } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RequestLike = Request | NextRequest;

export function getRequestOrigin(request: RequestLike) {
  return new URL(request.url).origin;
}

export function hasTrustedOrigin(request: RequestLike) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return true;
  }

  return origin === getRequestOrigin(request);
}

export function getClientAddress(request: RequestLike) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function getContentLength(request: RequestLike) {
  const rawValue = request.headers.get("content-length");

  if (!rawValue) {
    return 0;
  }

  const parsedValue = Number.parseInt(rawValue, 10);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export function isPayloadTooLarge(request: RequestLike, maxBytes: number) {
  return getContentLength(request) > maxBytes;
}

export function isValidEmailAddress(email: string) {
  return email.length <= 254 && EMAIL_PATTERN.test(email);
}

export function isSafeHttpUrl(value: string) {
  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:";
  } catch {
    return false;
  }
}
