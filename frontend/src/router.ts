import { createRouter, createWebHistory } from "vue-router";
import UserAuth from "./pages/auth/UserAuth.vue";
import AuthHome from "./pages/private/AuthHome.vue";
import AuthProducts from "./pages/private/AuthProducts.vue";
import AuthProductForm from "./pages/private/AuthProductForm.vue";
import AuthProductView from "./pages/private/AuthProductView.vue";
import store from "./store";
import { getLiveAuthCookie } from "./utils/authCookie";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: UserAuth, meta: { requiresGuest: true } },
    { path: "/auth", component: AuthHome, meta: { requiresAuth: true } },
    { path: "/auth/products", component: AuthProducts, meta: { requiresAuth: true } },
    { path: "/auth/products/create", component: AuthProductForm, meta: { requiresAuth: true } },
    { path: "/auth/products/update/:id", component: AuthProductForm, meta: { requiresAuth: true } },
    { path: "/auth/products/view/:id", component: AuthProductView, meta: { requiresAuth: true } },
  ],
});

router.beforeEach((to) => {
  const session = getLiveAuthCookie();

  if (session) {
    store.commit("auth/setAuth", {
      token: session.token,
      userId: session.userId,
      username: session.username,
      expiresAt: session.expiresAt,
    });
  } else {
    store.commit("auth/clearAuth");
  }

  const requiresAuth = to.matched.some((record) => Boolean(record.meta["requiresAuth"]));
  const requiresGuest = to.matched.some((record) => Boolean(record.meta["requiresGuest"]));

  if (requiresAuth && !session) {
    return "/";
  }

  if (requiresGuest && session) {
    return "/auth";
  }

  return true;
});

export default router;
