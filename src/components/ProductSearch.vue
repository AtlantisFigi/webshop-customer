<template>
  <div class="min-h-screen bg-gray-100 text-black p-8">
    <div class="flex justify-center mb-12">
      <div class="relative w-full md:w-1/2">
        <input
            type="text"
            v-model="searchTerm"
            placeholder="Zoek naar producten..."
            class="w-full p-3 pl-4 pr-24 bg-transparent text-black border-b-2 border-black focus:outline-none focus:border-b-2 focus:border-black"
        />
        <button
            @click="searchProducts"
            class="absolute right-0 top-0 bottom-0 text-black px-6 py-2 m-1"
            :disabled="isLoading"
        >
          Search
        </button>
      </div>
    </div>

    <div class="flex flex-col md:flex-row">
      <aside class="md:w-1/6 pr-0 md:pr-3 mb-4 md:mb-0">
        <h3 class="text-lg mb-4">Gender</h3>
        <ul class="mb-8 space-y-2">
          <li class="flex items-center">
            <input
                type="radio"
                id="man"
                value="man"
                v-model="selectedGenderCategory"
                @click="toggleCategory('gender', 'man')"
                class="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-2 focus:ring-gray-400"
            />
            <label for="man" class="ml-2 text-gray-700 cursor-pointer hover:text-gray-900 transition duration-300">
              Man
            </label>
          </li>
          <li class="flex items-center">
            <input
                type="radio"
                id="woman"
                value="woman"
                v-model="selectedGenderCategory"
                @click="toggleCategory('gender', 'woman')"
                class="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-2 focus:ring-gray-400"
            />
            <label for="woman" class="ml-2 text-gray-700 cursor-pointer hover:text-gray-900 transition duration-300">
              Woman
            </label>
          </li>
        </ul>

        <h3 class="text-lg mb-4">Product Type</h3>
        <ul class="mb-8 space-y-2">
          <li class="flex items-center">
            <input
                type="radio"
                id="pants"
                value="pants"
                v-model="selectedSubCategory"
                @click="toggleCategory('sub', 'pants')"
                class="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-2 focus:ring-gray-400"
            />
            <label for="pants" class="ml-2 text-gray-700 cursor-pointer hover:text-gray-900 transition duration-300">
              Pants
            </label>
          </li>
          <li class="flex items-center">
            <input
                type="radio"
                id="tops"
                value="tops"
                v-model="selectedSubCategory"
                @click="toggleCategory('sub', 'tops')"
                class="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-2 focus:ring-gray-400"
            />
            <label for="tops" class="ml-2 text-gray-700 cursor-pointer hover:text-gray-900 transition duration-300">
              Tops
            </label>
          </li>
          <li class="flex items-center">
            <input
                type="radio"
                id="accessories"
                value="accessories"
                v-model="selectedSubCategory"
                @click="toggleCategory('sub', 'accessories')"
                class="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-2 focus:ring-gray-400"
            />
            <label for="accessories" class="ml-2 text-gray-700 cursor-pointer hover:text-gray-900 transition duration-300">
              Accessories
            </label>
          </li>
        </ul>

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
import { ref, computed, watch, onMounted } from "vue";
import api from "../apiService.ts";
import { useRouter, useRoute } from "vue-router";
import {assignSelectedCategories} from "../categoryMappings.ts";
import {Product} from "../Product.ts";

const router = useRouter();
const route = useRoute();

const searchTerm = ref<string>('');
const selectedCategories = ref<string[]>([]);
const selectedGenderCategory = ref<string>("");
const selectedSubCategory = ref<string>("");
const products = ref<Product[]>([]);
const errorMessage = ref('');
const isLoading = ref(false);
const sortOption = ref('none');
const priceRange = ref([]);

// Functie om producten te zoeken
const searchProducts = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await api.post('api/product/search', {
      name: searchTerm.value.trim(),
      categories: selectedCategories.value
    });
    products.value = response.data;
    if (products.value.length === 0) {
      errorMessage.value = 'Geen producten gevonden voor deze zoekterm.';
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    errorMessage.value = 'Er is een fout opgetreden bij het ophalen van de producten.';
  } finally {
    isLoading.value = false;
  }
};

const updateSelectedCategories = () => {
  selectedCategories.value = [selectedGenderCategory.value, selectedSubCategory.value].filter(Boolean);
  updateUrl();
  searchProducts();
};

const toggleCategory = (type: string, value: string) => {
  if (type === 'sub') {
    if (selectedSubCategory.value === value) {
      selectedSubCategory.value = ''; // Deselecteer als dezelfde waarde is geselecteerd
    } else {
      selectedSubCategory.value = value; // Selecteer nieuwe waarde
    }
  } else if (type === 'gender') {
    if (selectedGenderCategory.value === value) {
      selectedGenderCategory.value = ''; // Deselecteer als dezelfde waarde is geselecteerd
    } else {
      selectedGenderCategory.value = value; // Selecteer nieuwe waarde
    }
  }
  updateSelectedCategories();
};

const updateUrl = () => {
  const query = {
    search: searchTerm.value || undefined,
    categories: selectedCategories.value.length > 0 ? selectedCategories.value : undefined
  };

  router.push({ query });
};

onMounted(() => {
  const initialSearchTerm = route.query.search;
  if (typeof initialSearchTerm === 'string') {
    searchTerm.value = initialSearchTerm;
    searchProducts();
  }

  const categoriesFromQuery = route.query.categories;
  if (categoriesFromQuery) {
    selectedCategories.value = Array.isArray(categoriesFromQuery)
        ? categoriesFromQuery.filter((category): category is string => typeof category === 'string')
        : [categoriesFromQuery].filter((category): category is string => typeof category === 'string');
  } else {
    selectedCategories.value = [];
  }

  const { selectedGenderCategory: gender, selectedSubCategory: subCat } = assignSelectedCategories(selectedCategories.value);
  selectedGenderCategory.value = gender;
  selectedSubCategory.value = subCat;

  updateUrl();
  searchProducts();
});

const sortedProducts = computed(() => {
  let sortedList = [...products.value];
  if (sortOption.value === 'priceAsc') {
    return sortedList.sort((a, b) => a.price - b.price);
  } else if (sortOption.value === 'priceDesc') {
    return sortedList.sort((a, b) => b.price - a.price);
  }
  return sortedList;
});

watch([selectedSubCategory, selectedGenderCategory], updateSelectedCategories);

</script>

<style scoped>
</style>
