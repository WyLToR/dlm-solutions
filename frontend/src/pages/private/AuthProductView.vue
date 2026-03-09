<template>
  <base-card>
    <div class="header">
      <h2>Product Details</h2>
      <base-button type="button" mode="flat" @click="goBack">Back to Products</base-button>
    </div>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="isLoading">Loading product...</p>

    <table v-else-if="product" class="product-table">
      <thead>
        <tr>
          <th>Article Number</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ product.articleNumber }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.description }}</td>
          <td>{{ formatPrice(product.price) }}</td>
          <td class="actions">
            <base-button type="button" mode="outline" @click="goToEdit">Update</base-button>
            <base-button type="button" mode="flat" @click="removeProduct">Delete</base-button>
          </td>
        </tr>
      </tbody>
    </table>
  </base-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { ProductResponse } from "../../types/dto";
import { ApiError, deleteProduct, fetchProductById } from "../../services/productsApi";

const route = useRoute();
const router = useRouter();

const isLoading = ref(true);
const errorMessage = ref<string | null>(null);
const product = ref<ProductResponse | null>(null);

const productId = computed(() => Number(route.params.id));

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("hu-HU", {
    style: "currency",
    currency: "HUF",
    maximumFractionDigits: 2,
  }).format(price);
};

const goBack = async (): Promise<void> => {
  await router.push("/auth/products");
};

const goToEdit = async (): Promise<void> => {
  if (!product.value) {
    return;
  }

  await router.push(`/auth/products/update/${product.value.id}`);
};

const loadProduct = async (): Promise<void> => {
  if (!Number.isInteger(productId.value) || productId.value <= 0) {
    errorMessage.value = "Invalid product id.";
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;

  try {
    product.value = await fetchProductById(productId.value);
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

const removeProduct = async (): Promise<void> => {
  if (!product.value) {
    return;
  }

  const confirmed = window.confirm("Are you sure you want to delete this product?");
  if (!confirmed) {
    return;
  }

  try {
    await deleteProduct(product.value.id);
    await router.replace("/auth/products");
  } catch (error: unknown) {
    if (error instanceof ApiError && error.status === 401) {
      await router.replace("/");
      return;
    }

    errorMessage.value = error instanceof Error ? error.message : "Could not delete product.";
  }
};

onMounted(async () => {
  await loadProduct();
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
}

.product-table th,
.product-table td {
  border: 1px solid #ddd;
  padding: 0.65rem;
  text-align: left;
}

.product-table th {
  background-color: #f7efff;
}

.actions {
  white-space: nowrap;
}

.error {
  color: #b42318;
}
</style>
