import type { Module } from "vuex";
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";
import type { RootState } from "../types";
import type { AuthState } from "./types";

const authModule: Module<AuthState, RootState> = {
  namespaced: true,
  state() {
    return {
      token: null,
      userId: null,
      username: null,
      expiresAt: null,
      isLoading: false,
      errorMessage: null,
    };
  },
  mutations,
  actions,
  getters,
};

export default authModule;
