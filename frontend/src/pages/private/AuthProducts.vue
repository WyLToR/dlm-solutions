<template>
  <base-card>
    <div class="header">
      <h2>Products</h2>
      <base-button type="button" @click="goToCreate">Create Product</base-button>
    </div>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="isLoading">Loading products...</p>
    <p v-else-if="products.length === 0">No products found.</p>

    <table v-else class="products-table">
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
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.articleNumber }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.description }}</td>
          <td>{{ formatPrice(product.price) }}</td>
          <td class="actions">
            <base-button type="button" mode="outline" @click="goToView(product.id)">View</base-button>
            <base-button type="button" mode="flat" @click="goToEdit(product.id)">Update</base-button>
          </td>
        </tr>
      </tbody>
    </table>
  </base-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import type { ProductResponse } from "../../types/dto";
import { ApiError, fetchProducts } from "../../services/productsApi";

const router = useRouter();

const isLoading = ref(true);
const errorMessage = ref<string | null>(null);
const products = ref<ProductResponse[]>([]);

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("hu-HU", {
    style: "currency",
    currency: "HUF",
    maximumFractionDigits: 2,
  }).format(price);
};

const loadProducts = async (): Promise<void> => {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    products.value = await fetchProducts();
  } catch (error: unknown) {
    if (error instanceof ApiError && error.status === 401) {
      await router.replace("/");
      return;
    }

    errorMessage.value = error instanceof Error ? error.message : "Could not load products.";
  } finally {
    isLoading.value = false;
  }
};

const goToCreate = async (): Promise<void> => {
  await router.push("/auth/products/create");
};

const goToEdit = async (id: number): Promise<void> => {
  await router.push(`/auth/products/update/${id}`);
};

const goToView = async (id: number): Promise<void> => {
  await router.push(`/auth/products/view/${id}`);
};

onMounted(async () => {
  await loadProducts();
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
}

.products-table th,
.products-table td {
  border: 1px solid #ddd;
  padding: 0.65rem;
  text-align: left;
}

.products-table th {
  background-color: #f7efff;
}

.actions {
  white-space: nowrap;
}

.error {
  color: #b42318;
}
</style>
