<template>
  <button
    v-if="!props.link"
    :class="props.mode || undefined"
    :type="props.type"
    @click="emit('click', $event)"
  >
    <slot></slot>
  </button>
  <router-link
    v-else
    :to="props.to"
    :class="props.mode || undefined"
    @click="emit('click', $event)"
  >
    <slot></slot>
  </router-link>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

type ButtonMode = "" | "flat" | "outline";
type ButtonType = "button" | "submit" | "reset";

const props = withDefaults(
  defineProps<{
    mode?: ButtonMode;
    link?: boolean;
    to?: RouteLocationRaw;
    type?: ButtonType;
  }>(),
  {
    mode: "",
    link: false,
    to: "/",
    type: "submit",
  }
);

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<style scoped>
button,
a {
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  font: inherit;
  background-color: #3a0061;
  border: 1px solid #3a0061;
  color: white;
  cursor: pointer;
  border-radius: 30px;
  margin-right: 0.5rem;
  display: inline-block;
}

a:hover,
a:active,
button:hover,
button:active {
  background-color: #270041;
  border-color: #270041;
}

.flat {
  background-color: transparent;
  color: #3a0061;
  border: none;
}

.outline {
  background-color: transparent;
  border-color: #270041;
  color: #270041;
}

.flat:hover,
.flat:active,
.outline:hover,
.outline:active {
  background-color: #edd2ff;
}
</style>
