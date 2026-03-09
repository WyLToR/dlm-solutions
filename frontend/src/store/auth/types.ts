export type AuthMode = "login" | "signup";

export interface AuthSession {
  token: string;
  userId: number;
  username: string;
  expiresAt: number;
}

export interface AuthPayload {
  mode: AuthMode;
  username: string;
  password: string;
}

export interface AuthState {
  token: string | null;
  userId: number | null;
  username: string | null;
  expiresAt: number | null;
  isLoading: boolean;
  errorMessage: string | null;
}
