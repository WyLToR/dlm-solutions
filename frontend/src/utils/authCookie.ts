const AUTH_COOKIE_NAME = "dlm_auth";
const DEFAULT_AUTH_LIFETIME_SECONDS = 2 * 60 * 60;

export interface AuthCookieSession {
  token: string;
  userId: number;
  username: string;
  expiresAt: number;
}

interface AuthCookieSeed {
  token: string;
  userId: number;
  username: string;
}

function parseJwtExpiry(token: string): number | null {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  const payloadPart = parts[1];
  if (typeof payloadPart !== "string") {
    return null;
  }

  try {
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const payloadJson = atob(padded);
    const payload: unknown = JSON.parse(payloadJson);

    if (!payload || typeof payload !== "object") {
      return null;
    }

    const exp = (payload as { exp?: unknown }).exp;
    if (typeof exp !== "number") {
      return null;
    }

    return exp * 1000;
  } catch {
    return null;
  }
}

function isAuthCookieSession(value: unknown): value is AuthCookieSession {
  if (!value || typeof value !== "object") {
    return false;
  }

  const session = value as Partial<AuthCookieSession>;
  return (
    typeof session.token === "string" &&
    typeof session.userId === "number" &&
    typeof session.username === "string" &&
    typeof session.expiresAt === "number"
  );
}

function getCookieValue(name: string): string | null {
  const key = `${name}=`;
  const parts = document.cookie.split(";");

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith(key)) {
      return decodeURIComponent(trimmed.slice(key.length));
    }
  }

  return null;
}

export function clearAuthCookie(): void {
  document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function getAuthCookie(): AuthCookieSession | null {
  const raw = getCookieValue(AUTH_COOKIE_NAME);
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isAuthCookieSession(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function hasLiveAuthCookie(): boolean {
  const session = getAuthCookie();
  if (!session) {
    return false;
  }

  return session.expiresAt > Date.now();
}

export function getLiveAuthCookie(): AuthCookieSession | null {
  const session = getAuthCookie();
  if (!session) {
    return null;
  }

  if (session.expiresAt <= Date.now()) {
    clearAuthCookie();
    return null;
  }

  return session;
}

export function setAuthCookie(seed: AuthCookieSeed): AuthCookieSession | null {
  const jwtExpiry = parseJwtExpiry(seed.token);
  const expiresAt = jwtExpiry ?? Date.now() + DEFAULT_AUTH_LIFETIME_SECONDS * 1000;
  const maxAge = Math.floor((expiresAt - Date.now()) / 1000);

  if (maxAge <= 0) {
    clearAuthCookie();
    return null;
  }

  const session: AuthCookieSession = {
    token: seed.token,
    userId: seed.userId,
    username: seed.username,
    expiresAt,
  };

  const value = encodeURIComponent(JSON.stringify(session));
  document.cookie = `${AUTH_COOKIE_NAME}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;

  return session;
}
