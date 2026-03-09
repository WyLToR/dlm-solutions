import type { ActionTree } from "vuex";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../../types/dto";
import { clearAuthCookie, getLiveAuthCookie, setAuthCookie } from "../../utils/authCookie";
import type { RootState } from "../types";
import type { AuthMode, AuthPayload, AuthSession, AuthState } from "./types";

interface ApiErrorResponse {
  message?: string;
}

const API_ORIGIN = import.meta.env.PROD ? "" : (import.meta.env.VITE_API_URL ?? "http://localhost:5190");
const API_BASE_URL = API_ORIGIN.replace(/\/+$/, "");
const AUTH_API_BASE_URL = `${API_BASE_URL}/api/Auth`;

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  return "message" in value;
}

async function authenticateRequest(
  mode: AuthMode,
  payload: LoginRequest | RegisterRequest
): Promise<LoginResponse | RegisterResponse> {
  const endpoint = mode === "login" ? "login" : "register";
  const response = await fetch(`${AUTH_API_BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Authentication failed.";

    try {
      const maybeError: unknown = await response.json();
      if (isApiErrorResponse(maybeError) && typeof maybeError.message === "string") {
        message = maybeError.message;
      }
    } catch {
      // Ignore malformed/non-JSON error payloads and use fallback message.
    }

    throw new Error(message);
  }

  return (await response.json()) as LoginResponse | RegisterResponse;
}

const actions: ActionTree<AuthState, RootState> = {
  async authenticate(context, payload: AuthPayload): Promise<void> {
    context.commit("setLoading", true);
    context.commit("setError", null);

    try {
      const authRequest: LoginRequest | RegisterRequest = {
        username: payload.username,
        password: payload.password,
      };
      const authResponse = await authenticateRequest(payload.mode, authRequest);
      const cookieSession = setAuthCookie({
        token: authResponse.token,
        userId: authResponse.userId,
        username: authResponse.username,
      });

      if (!cookieSession) {
        throw new Error("Authentication session expired too quickly.");
      }

      const session: AuthSession = {
        token: cookieSession.token,
        userId: cookieSession.userId,
        username: cookieSession.username,
        expiresAt: cookieSession.expiresAt,
      };

      context.commit("setAuth", session);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Authentication failed.";
      context.commit("setError", message);
      context.commit("clearAuth");
      clearAuthCookie();
      throw error;
    } finally {
      context.commit("setLoading", false);
    }
  },
  restoreSession(context): void {
    const session = getLiveAuthCookie();

    if (!session) {
      context.commit("clearAuth");
      return;
    }

    const authSession: AuthSession = {
      token: session.token,
      userId: session.userId,
      username: session.username,
      expiresAt: session.expiresAt,
    };
    context.commit("setAuth", authSession);
  },
  logout(context): void {
    clearAuthCookie();
    context.commit("clearAuth");
  },
};

export default actions;
