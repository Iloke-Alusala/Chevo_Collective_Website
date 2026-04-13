import "server-only";

import crypto from "node:crypto";

export const ADMIN_SESSION_COOKIE =
  process.env.NODE_ENV === "production"
    ? "__Host-chevo-admin-session"
    : "chevo-admin-session";
const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "chevo-local-admin";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 12;

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

function getAdminSessionSecret() {
  if (process.env.CHEVO_ADMIN_SESSION_SECRET) {
    return process.env.CHEVO_ADMIN_SESSION_SECRET;
  }

  const credentials = getAdminCredentials();

  return `${credentials.username}:${credentials.password}:${ADMIN_SESSION_COOKIE}`;
}

function getSessionSigningSecret() {
  const credentials = getAdminCredentials();
  return `${getAdminSessionSecret()}:${credentials.username}:${credentials.password}`;
}

export function isAdminSecurityConfigured() {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }

  return Boolean(
    process.env.CHEVO_ADMIN_USERNAME &&
      process.env.CHEVO_ADMIN_PASSWORD &&
      process.env.CHEVO_ADMIN_SESSION_SECRET,
  );
}

export function getAdminSecuritySetupMessage() {
  return "Set CHEVO_ADMIN_USERNAME, CHEVO_ADMIN_PASSWORD, and CHEVO_ADMIN_SESSION_SECRET before enabling live admin access.";
}

export function validateAdminCredentials(username: string, password: string) {
  const credentials = getAdminCredentials();

  return (
    safeEqual(username.trim(), credentials.username) &&
    safeEqual(password, credentials.password)
  );
}

export function createAdminSessionValue() {
  const nonce = crypto.randomBytes(16).toString("hex");
  const expiresAt = String(Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000);
  const payload = `${expiresAt}.${nonce}`;
  const signature = crypto
    .createHmac("sha256", getSessionSigningSecret())
    .update(payload)
    .digest("hex");

  return `${payload}.${signature}`;
}

export function isValidAdminSession(value?: string) {
  if (!value) {
    return false;
  }

  const parts = value.split(".");

  if (parts.length !== 3) {
    return false;
  }

  const [expiresAt, nonce, signature] = parts;
  const expiresAtNumber = Number.parseInt(expiresAt, 10);

  if (!Number.isFinite(expiresAtNumber) || expiresAtNumber <= Date.now()) {
    return false;
  }

  if (!nonce || !signature) {
    return false;
  }

  const payload = `${expiresAt}.${nonce}`;
  const expectedSignature = crypto
    .createHmac("sha256", getSessionSigningSecret())
    .update(payload)
    .digest("hex");

  return safeEqual(signature, expectedSignature);
}

export function getAdminSessionTtlSeconds() {
  return ADMIN_SESSION_TTL_SECONDS;
}

export function getDefaultAdminHint() {
  return {
    username: DEFAULT_ADMIN_USERNAME,
    password: DEFAULT_ADMIN_PASSWORD,
  };
}
