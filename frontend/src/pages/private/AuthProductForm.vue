<template>
  <base-card>
    <h2>{{ pageTitle }}</h2>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="isLoading">Loading product...</p>

    <form v-else @submit.prevent="submitForm">
      <div class="form-control">
        <label for="name">Name</label>
        <input id="name" v-model.trim="name" type="text" placeholder="Product name" />
      </div>
      <div class="form-control">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model.trim="description"
          rows="4"
          placeholder="Product description"
        ></textarea>
      </div>
      <div class="form-control">
        <label for="price">Price</label>
        <input id="price" v-model.number="price" type="number" min="0" step="0.01" />
      </div>

      <p v-if="validationMessage" class="error">{{ validationMessage }}</p>

      <div class="actions">
        <base-button type="submit">{{ submitLabel }}</base-button>
        <base-button type="button" mode="flat" @click="cancel">Cancel</base-button>
      </div>
    </form>
  </base-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { ProductCreateRequest, ProductUpdateRequest } from "../../types/dto";
import { ApiError, createProduct, fetchProductById, updateProduct } from "../../services/productsApi";
import { getLiveAuthCookie } from "../../utils/authCookie";

const route = useRoute();
const router = useRouter();

const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const validationMessage = ref<string | null>(null);

const name = ref("");
const description = ref("");
const price = ref<number>(0);

const isEditMode = computed(() => typeof route.params.id !== "undefined");
const productId = computed(() => Number(route.params.id));
const pageTitle = computed(() => (isEditMode.value ? "Update Product" : "Create Product"));
const submitLabel = computed(() => (isEditMode.value ? "Update" : "Create"));

const validateForm = (): boolean => {
  validationMessage.value = null;

  if (name.value.trim().length === 0) {
    validationMessage.value = "Name is required.";
    return false;
  }

  if (description.value.trim().length === 0) {
    validationMessage.value = "Description is required.";
    return false;
  }

  if (Number.isNaN(price.value) || price.value < 0) {
    validationMessage.value = "Price cannot be negative.";
    return false;
  }

  return true;
};

const cancel = async (): Promise<void> => {
  if (isEditMode.value && Number.isInteger(productId.value) && productId.value > 0) {
    await router.push(`/auth/products/view/${productId.value}`);
    return;
  }

  await router.push("/auth/products");
};

const loadProduct = async (): Promise<void> => {
  if (!isEditMode.value) {
    return;
  }

  if (!Number.isInteger(productId.value) || productId.value <= 0) {
    errorMessage.value = "Invalid product id.";
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;

  try {
    const product = await fetchProductById(productId.value);
    name.value = product.name;
    description.value = product.description;
    price.value = product.price;
  } catch (error: unknown) {
    if (error instanceof ApiError && error.status === 401) {
      await router.replace("/");
      return;
    }

    if (error instanceof ApiError && error.status === 404) {
      errorMessage.value = "Product not found.";
    } else {
      errorMessage.value = error instanceof Error ? error.message : "Could not load product.";
    }
  } finally {
    isLoading.value = false;
  }
};

const submitForm = async (): Promise<void> => {
  if (!validateForm()) {
    return;
  }

  const session = getLiveAuthCookie();
  if (!session) {
    await router.replace("/");
    return;
  }

  errorMessage.value = null;

  try {
    if (isEditMode.value) {
      if (!Number.isInteger(productId.value) || productId.value <= 0) {
        errorMessage.value = "Invalid product id.";
        return;
      }

      const payload: ProductUpdateRequest = {
        name: name.value.trim(),
        description: description.value.trim(),
        price: price.value,
        userId: session.userId,
      };

      await updateProduct(productId.value, payload);
      await router.replace(`/auth/products/view/${productId.value}`);
      return;
    }

    const payload: ProductCreateRequest = {
      name: name.value.trim(),
      description: description.value.trim(),
      price: price.value,
      userId: session.userId,
    };
    const created = await createProduct(payload);
    await router.replace(`/auth/products/view/${created.id}`);
  } catch (error: unknown) {
    if (error instanceof ApiError && error.status === 401) {
      await router.replace("/");
      return;
    }

    errorMessage.value = error instanceof Error ? error.message : "Could not save product.";
  }
};

onMounted(async () => {
  await loadProduct();
});
</script>

<style scoped>
form {
  margin-top: 1rem;
}

.form-control {
  margin: 0.75rem 0;
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
  padding: 0.4rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}

.actions {
  margin-top: 1rem;
}

.error {
  color: #b42318;
}
</style>
