import { createStore } from "vuex";
import authModule from "./auth/index";
import type { RootState } from "./types";

const store = createStore<RootState>({
  modules: {
    auth: authModule,
  },
});

export default store;
