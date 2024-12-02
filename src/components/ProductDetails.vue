<template>
  <div class="min-h-screen bg-gray-100 text-black p-8">
    <div class="max-w-5xl w-full overflow-hidden">
      <div v-if="isLoading && product" class="flex justify-center items-center p-16">
        <span class="text-lg font-medium text-gray-600">Productdetails laden...</span>
      </div>
        <div v-else class="flex flex-col md:flex-row">
          <!-- Linkerkolom: Productafbeelding -->
          <div class="w-full md:w-1/2 bg-gray-50">
            <img
                src="https://via.placeholder.com/150"
                alt="Product afbeelding"
                class="w-full h-full object-cover"
            />
          </div>

          <!-- Rechterkolom: Productinformatie -->
          <div class="w-full md:w-1/2 p-8">
            <h1 class="text-3xl font-extrabold text-gray-900 mb-4">{{ product?.name }}</h1>
            <p class="text-gray-700 text-base leading-relaxed mb-6">{{ product?.description }}</p>
            <p class="text-lg font-semibold text-gray-900 mb-8">
              Prijs:
              <span class="text-green-600">€{{ product?.price }}</span>
            </p>
            <button
                @click="goBack"
                class="bg-black text-white px-6 py-3 rounded shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all"
            >
              Terug naar overzicht
            </button>
          </div>
        </div>
      </div>
      <!-- Foutmelding -->
      <div v-if="errorMessage" class="text-center p-4">
        <p class="text-red-600 font-medium">{{ errorMessage }}</p>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "../apiService.ts";
import { useRoute, useRouter } from "vue-router";
import { Product } from "../Product.ts";

const route = useRoute();
const router = useRouter();

const product = ref<Product | null>(null); // Details van het product
const isLoading = ref(false); // Laadstatus
const errorMessage = ref(""); // Foutmelding

// Functie om productgegevens op te halen
const fetchProductDetails = async () => {
  const productId = route.params.id; // Haal het product-ID uit de route

  if (!productId) {
    errorMessage.value = "Geen product-ID gevonden.";
    return;
  }

  isLoading.value = true;
  try {
    const response = await api.get(`api/product/${productId}`);
    product.value = response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    errorMessage.value = "Er is een fout opgetreden bij het ophalen van de productdetails.";
  } finally {
    isLoading.value = false;
  }
};

// Ga terug naar de vorige pagina
const goBack = () => {
  router.push({ name: "ProductSearch" });
};

// Haal de productdetails op bij het laden van de component
onMounted(fetchProductDetails);
</script>

<style scoped>

</style>