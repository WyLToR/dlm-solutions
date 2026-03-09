<template>
    <base-card>
        <form @submit.prevent="submitForm">
            <div class="form-control">
                <label for="username">Username</label>
                <input id="username" v-model.trim="username" type="text" placeholder="username" />
            </div>
            <div class="form-control">
                <label for="password">Password</label>
                <input id="password" v-model.trim="password" type="password" placeholder="password" />
            </div>
            <p v-if="!formIsValid">
                Please enter a valid username and password (must be at least 4 characters long).
            </p>
            <p v-if="authError">{{ authError }}</p>
            <base-button>{{ submitButtonCaption }}</base-button>
            <base-button type="button" mode="flat" @click="switchAuthMode">
                {{ switchModeButtonCaption }}
            </base-button>
        </form>
    </base-card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import type { RootState } from "../../store/types";
import type { AuthMode, AuthPayload } from "../../store/auth/types";

const router = useRouter();
const store = useStore<RootState>();

const username = ref("");
const password = ref("");
const formIsValid = ref(true);
const mode = ref<AuthMode>("login");

const submitButtonCaption = computed(() => (mode.value === "login" ? "Login" : "Signup"));
const switchModeButtonCaption = computed(() =>
    mode.value === "login" ? "Signup instead" : "Login instead"
);
const authError = computed(() => store.state.auth.errorMessage);

const submitForm = async (): Promise<void> => {
    formIsValid.value = true;
    if (username.value === "" || password.value.length < 4) {
        formIsValid.value = false;
        return;
    }

    const payload: AuthPayload = {
        mode: mode.value,
        username: username.value,
        password: password.value,
    };

    try {
        await store.dispatch("auth/authenticate", payload);
        await router.replace("/auth");
    } catch {
        // Error state is handled in the auth module.
    }
};

const switchAuthMode = (): void => {
    mode.value = mode.value === "login" ? "signup" : "login";
};
</script>
<style scoped>
form {
    margin: 1rem;
    border: 1px solid #ccc;
    border-radius: 12px;
    padding: 1rem;
}

.form-control {
    margin: 0.5rem 0;
}

label {
    font-weight: bold;
    margin-bottom: 0.5rem;
    display: block;
}

input,
textarea {
    display: block;
    width: 100%;
    font: inherit;
    border: 1px solid #ccc;
    padding: 0.15rem;
}

input:focus,
textarea:focus {
    border-color: #3d008d;
    background-color: #faf6ff;
    outline: none;
}
</style>
