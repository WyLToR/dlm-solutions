<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AuthGlobalHeader from "./components/layout/AuthGlobalHeader.vue";

const route = useRoute();
const isAuthRoute = computed(() => route.path.startsWith("/auth"));
</script>

<template>
  <div class="app-shell">
    <auth-global-header v-if="isAuthRoute" />
    <router-view v-slot="slotProps">
      <transition name="route" mode="out-in">
        <component :is="slotProps.Component"></component>
      </transition>
    </router-view>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

* {
  box-sizing: border-box;
}

html {
  font-family: "Roboto", sans-serif;
}

body {
  margin: 0;
}

#app {
  min-height: 100vh;
  background: linear-gradient(180deg, #ffffff 0%, #f6f2ff 100%);
}

.app-shell {
  min-height: 100vh;
}

.route-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.route-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.route-enter-active {
  transition: all 0.3s ease-out;
}

.route-leave-active {
  transition: all 0.3s ease-in;
}

.route-enter-to,
.route-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
