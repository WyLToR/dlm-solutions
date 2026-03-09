<template>
  <header class="auth-header">
    <div class="auth-header__row">
      <button type="button" class="back-btn" @click="goBack">Back</button>
      <p class="user-label">Signed in: <strong>{{ usernameLabel }}</strong></p>
    </div>

    <nav aria-label="Breadcrumb" class="breadcrumbs">
      <template v-for="(crumb, index) in breadcrumbs" :key="crumb.label + index">
        <router-link v-if="crumb.to && index < breadcrumbs.length - 1" :to="crumb.to">
          {{ crumb.label }}
        </router-link>
        <span v-else class="active">{{ crumb.label }}</span>
        <span v-if="index < breadcrumbs.length - 1" class="sep">/</span>
      </template>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter, type RouteLocationRaw } from "vue-router";
import { useStore } from "vuex";
import type { RootState } from "../../store/types";

interface Breadcrumb {
  label: string;
  to?: RouteLocationRaw;
}

const route = useRoute();
const router = useRouter();
const store = useStore<RootState>();

const usernameLabel = computed(() => store.state.auth.username ?? "unknown");

const breadcrumbs = computed<Breadcrumb[]>(() => {
  const items: Breadcrumb[] = [{ label: "Auth", to: "/auth" }];

  if (route.path === "/auth") {
    return items;
  }

  if (!route.path.startsWith("/auth/products")) {
    return items;
  }

  items.push({ label: "Products", to: "/auth/products" });

  if (route.path === "/auth/products") {
    return items;
  }

  if (route.path === "/auth/products/create") {
    items.push({ label: "Create" });
    return items;
  }

  const id = String(route.params.id ?? "");

  if (route.path.startsWith("/auth/products/view/")) {
    items.push({ label: `View ${id}` });
    return items;
  }

  if (route.path.startsWith("/auth/products/update/")) {
    items.push({ label: `Update ${id}` });
    return items;
  }

  return items;
});

const goBack = async (): Promise<void> => {
  if (window.history.length > 1) {
    await router.back();
    return;
  }

  const fallback = breadcrumbs.value[breadcrumbs.value.length - 2];
  await router.push(fallback?.to ?? "/auth");
};
</script>

<style scoped>
.auth-header {
  position: sticky;
  top: 0;
  z-index: 30;
  background: linear-gradient(90deg, #f9f2ff 0%, #efe5ff 100%);
  border-bottom: 1px solid #e1d1f7;
  padding: 0.75rem 1rem;
}

.auth-header__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-btn {
  border: 1px solid #270041;
  background-color: white;
  color: #270041;
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  cursor: pointer;
}

.user-label {
  margin: 0;
}

.breadcrumbs {
  margin-top: 0.5rem;
  font-size: 0.92rem;
}

.breadcrumbs a {
  color: #3a0061;
  text-decoration: none;
}

.breadcrumbs a:hover {
  text-decoration: underline;
}

.active {
  font-weight: 700;
}

.sep {
  margin: 0 0.4rem;
  color: #7d6d96;
}
</style>
