<template>
  <div class="min-h-screen bg-gray-100 text-black p-8">
    <!-- Zoekbalk -->
    <div class="flex justify-center mb-12">
      <div class="relative w-full md:w-1/2">
        <input
            type="text"
            v-model="searchTerm"
            placeholder="Zoek naar producten..."
            class="w-full p-3 pl-4 pr-24 bg-transparent text-black border-b-2 border-black focus:outline-none focus:border-b-2 focus:border-black"
        />
        <button
            @click="updateUrlAndSearch"
            class="absolute right-0 top-0 bottom-0 text-black px-6 py-2 m-1"
            :disabled="isLoading"
        >
          Search
        </button>
      </div>
    </div>

    <div class="flex flex-col md:flex-row">
      <!-- Categorieën Sidebar -->
      <aside class="md:w-1/6 pr-0 md:pr-3 mb-4 md:mb-0">
        <h3 class="text-lg mb-4">Categorieën</h3>
        <ul class="mb-8 space-y-2">
          <li v-for="category in categories" :key="category.id" class="flex items-center">
            <input
                type="checkbox"
                :id="category.name"
                :value="category.name"
                v-model="selectedCategories"
                @change="updateUrlAndSearch"
                class="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-2 focus:ring-gray-400"
            />
            <label
                :for="category.name"
                class="ml-2 text-gray-700 cursor-pointer hover:text-gray-900 transition duration-300"
            >
              {{ category.name }}
            </label>
          </li>
        </ul>

        <!-- Prijsfilter -->
        <h3 class="text-lg mb-4">Prijs</h3>
        <div class="flex">
          <div class="mr-4">
            <input
                type="number"
                id="minPrice"
                v-model="priceRange[0]"
                class="border border-gray-300 rounded-md p-2 w-full"
                placeholder="Min"
            />
          </div>
          <div>
            <input
                type="number"
                id="maxPrice"
                v-model="priceRange[1]"
                class="border border-gray-300 rounded-md p-2 w-full"
                placeholder="Max"
            />
          </div>
        </div>
      </aside>

      <!-- Producten -->
      <div class="sm:w-auto md:w-5/6">
        <div v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</div>

        <div v-if="!isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
              v-for="product in sortedProducts"
              :key="product.id"
              class="bg-gray-100 hover:bg-gray-200 transition-all duration-300 ease-in-out rounded-lg overflow-hidden"
          >
            <div class="relative w-full mb-1" style="aspect-ratio: 4 / 5">
              <img :src="product.image" alt="" class="absolute inset-0 w-full h-full object-cover" />
              <div class="absolute top-2 left-2 bg-black text-white p-2 text-sm">
                €{{ product.price }}
              </div>
            </div>
            <h2 class="text-lg px-2">{{ product.name }}</h2>
            <p class="text-sm text-gray-600 mb-4 px-2">{{ product.description }}</p>
          </div>
        </div>

        <div v-if="isLoading" class="text-center">
          <p>Producten laden...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import api from "../apiService.ts";
import { useRouter, useRoute } from "vue-router";
import { Product } from "../Product.ts";
import { Category } from "../category.ts";
import { websocketService } from '../websocket';

const router = useRouter();
const route = useRoute();

// Reactieve variabelen
const searchTerm = ref<string>(""); // Zoekterm
const selectedCategories = ref<string[]>([]); // Geselecteerde categorieën (meerdere mogelijk)
const products = ref<Product[]>([]); // Productenlijst
const categories = ref<Category[]>([]); // Lijst van alle categorieën
const errorMessage = ref<string>(""); // Error berichten
const isLoading = ref<boolean>(false); // Laadstatus
const sortOption = ref<string>("none"); // Sorteeroptie
const priceRange = ref<number[]>([0, 1000]); // Prijsbereik

// Functie: Haal categorieën op van de API
const fetchCategories = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await api.get("api/category/all");
    categories.value = response.data; // Vul de categorieënlijst
  } catch (error) {
    console.error("Error fetching categories:", error);
    errorMessage.value = "Er is een fout opgetreden bij het ophalen van de categorieën.";
  } finally {
    isLoading.value = false;
  }
};

// Functie: Haal producten op op basis van zoekterm en geselecteerde categorieën
const searchProducts = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await api.post("api/product/search", {
      name: searchTerm.value.trim(),
      categories: selectedCategories.value,
    });
    products.value = response.data; // Vul de productenlijst
    if (products.value.length === 0) {
      errorMessage.value = "Geen producten gevonden voor deze zoekterm.";
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    errorMessage.value = "Er is een fout opgetreden bij het ophalen van de producten.";
  } finally {
    isLoading.value = false;
  }
};

// Functie: Bijwerken van de URL en uitvoeren van een nieuwe zoekopdracht
const updateUrlAndSearch = () => {
  const query = {
    search: searchTerm.value || undefined,
    categories: selectedCategories.value.length > 0 ? selectedCategories.value : undefined,
  };

  router.push({ query });
  searchProducts();
};

// Lifecycle Hook: Voer bij het laden van de component de eerste zoekopdracht uit
onMounted(async () => {
  await fetchCategories(); // Haal categorieën op

  // Zoekterm en categorieën uit de URL-query ophalen
  const querySearch = route.query.search as string;
  const queryCategories = route.query.categories as string | string[];

  if (querySearch) {
    searchTerm.value = querySearch; // Stel zoekterm in vanuit de URL
  }

  if (queryCategories) {
    selectedCategories.value = Array.isArray(queryCategories)
        ? queryCategories
        : [queryCategories];
  }

  websocketService.connect();

  websocketService.subscribe("/topic/products", (updatedProduct: Product) => {
    updateProductRealtime(updatedProduct); // Werk product lokaal bij
  });

  // Voer een eerste zoekopdracht uit
  searchProducts();
});

onBeforeUnmount(() => {
  websocketService.unsubscribe("/topic/products");
  websocketService.disconnect();
});

const updateProductRealtime = (updatedProduct: Product) => {
  const index = products.value.findIndex((product) => product.id === updatedProduct.id);
  if (index !== -1) {
    products.value[index] = updatedProduct; // Werk bestaand product bij
  } else {
    products.value.push(updatedProduct); // Voeg nieuw product toe als het niet bestaat
  }
};


// Reactieve sortering van producten
const sortedProducts = computed(() => {
  let sortedList = [...products.value];

  if (sortOption.value === "priceAsc") {
    return sortedList.sort((a, b) => a.price - b.price);
  } else if (sortOption.value === "priceDesc") {
    return sortedList.sort((a, b) => b.price - a.price);
  }

  return sortedList;
});
</script>


<style scoped>
</style>
