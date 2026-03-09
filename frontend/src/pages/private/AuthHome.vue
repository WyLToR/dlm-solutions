<template>
  <base-card>
    <h2>Authenticated Area</h2>
    <p>You are logged in as: <strong>{{ usernameLabel }}</strong></p>
    <base-button type="button" @click="goToProducts">Products</base-button>
    <base-button type="button" mode="outline" @click="logout">Logout</base-button>
  </base-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import type { RootState } from "../../store/types";

const router = useRouter();
const store = useStore<RootState>();

const usernameLabel = computed(() => store.state.auth.username ?? "unknown");

const goToProducts = async (): Promise<void> => {
  await router.push("/auth/products");
};

const logout = async (): Promise<void> => {
  await store.dispatch("auth/logout");
  await router.replace("/");
};
</script>
