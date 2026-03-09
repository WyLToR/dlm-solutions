import type { GetterTree } from "vuex";
import type { RootState } from "../types";
import type { AuthState } from "./types";

const getters: GetterTree<AuthState, RootState> = {
  userId(state): number | null {
    return state.userId;
  },
  token(state): string | null {
    return state.token;
  },
  username(state): string | null {
    return state.username;
  },
  expiresAt(state): number | null {
    return state.expiresAt;
  },
  isAuthenticated(state): boolean {
    return state.token !== null && state.expiresAt !== null && state.expiresAt > Date.now();
  },
  isLoading(state): boolean {
    return state.isLoading;
  },
  error(state): string | null {
    return state.errorMessage;
  },
};

export default getters;
