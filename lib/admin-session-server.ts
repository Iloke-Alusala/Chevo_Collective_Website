import "server-only";

import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  getDefaultAdminHint,
  getAdminSecuritySetupMessage,
  isAdminSecurityConfigured,
  isValidAdminSession,
  usingDefaultAdminCredentials,
} from "@/lib/admin-auth";

export async function getAdminSessionState() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const isSecurityConfigured = isAdminSecurityConfigured();
  const isAuthenticated = isSecurityConfigured && isValidAdminSession(sessionValue);

  return {
    isAuthenticated,
    isSecurityConfigured,
    securityMessage: isSecurityConfigured
      ? null
      : getAdminSecuritySetupMessage(),
    defaultCredentials:
      usingDefaultAdminCredentials() ? getDefaultAdminHint() : null,
  };
}
