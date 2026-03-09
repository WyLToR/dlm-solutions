import type { MutationTree } from "vuex";
import type { AuthSession, AuthState } from "./types";

const mutations: MutationTree<AuthState> = {
  setLoading(state, isLoading: boolean): void {
    state.isLoading = isLoading;
  },
  setError(state, message: string | null): void {
    state.errorMessage = message;
  },
  setAuth(state, payload: AuthSession): void {
    state.token = payload.token;
    state.userId = payload.userId;
    state.username = payload.username;
    state.expiresAt = payload.expiresAt;
  },
  clearAuth(state): void {
    state.token = null;
    state.userId = null;
    state.username = null;
    state.expiresAt = null;
  },
};

export default mutations;
