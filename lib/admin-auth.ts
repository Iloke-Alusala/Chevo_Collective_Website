import "server-only";

import crypto from "node:crypto";

export const ADMIN_SESSION_COOKIE = "chevo-admin-session";
const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "chevo-local-admin";

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function getAdminCredentials() {
  return {
    username: process.env.CHEVO_ADMIN_USERNAME || DEFAULT_ADMIN_USERNAME,
    password: process.env.CHEVO_ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD,
  };
}

export function usingDefaultAdminCredentials() {
  return !process.env.CHEVO_ADMIN_USERNAME && !process.env.CHEVO_ADMIN_PASSWORD;
}

export function validateAdminCredentials(username: string, password: string) {
  const credentials = getAdminCredentials();

  return (
    safeEqual(username.trim(), credentials.username) &&
    safeEqual(password, credentials.password)
  );
}

export function createAdminSessionValue() {
  const credentials = getAdminCredentials();

  return crypto
    .createHash("sha256")
    .update(
      `${credentials.username}:${credentials.password}:${ADMIN_SESSION_COOKIE}`,
    )
    .digest("hex");
}

export function isValidAdminSession(value?: string) {
  if (!value) {
    return false;
  }

  return safeEqual(value, createAdminSessionValue());
}

export function getDefaultAdminHint() {
  return {
    username: DEFAULT_ADMIN_USERNAME,
    password: DEFAULT_ADMIN_PASSWORD,
  };
}
