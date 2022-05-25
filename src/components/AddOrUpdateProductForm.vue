<script setup lang="ts">
import { Product, ProductCategory } from '@/Types/ProductTypes';
import SearchSelect from './SearchSelect.vue';
import { SearchSelectOption } from '@/Types/GenericArrayType';
import { GenericArray } from '@/Types/GenericArrayType';
import { getProductCategoriesWithoutPagination } from '@/services/ProductCategoryService';
import { ref } from 'vue';
import { useProductsStore } from '@/stores/ProductsStore';

defineProps<{
    updatedProduct?: Product
}>();

const productsStore = useProductsStore();

const categories = ref<SearchSelectOption[]>([]);
const productName = ref<string>();
const productHeight = ref<number>();
const productDiameter = ref<number>();
const productWeight = ref<number>();
const productPriceWithoutVAT = ref<number>();
const productProductionCost = ref<number>();
const productCategoryId = ref<number>();


(await getProductsCategories());

async function getProductsCategories() {
    let response = (await getProductCategoriesWithoutPagination());
    response.forEach(option => {
        const newOption = {
            "id": option.id,
            "value": option.categoryName
        }
        categories.value.push(newOption);
    })
}
let newProduct: Product;

function getSelectedCategory(selectedCategory: SearchSelectOption) {
    // newProduct.productCategory.id = selectedCategory.id.valueOf();
    // newProduct.productCategory.categoryName = selectedCategory.value.valueOf();
    productCategoryId.value = selectedCategory.id.valueOf();
}
function addProduct() {
    const auxProduct = {
        "name": productName.value!,
        "productCategoryId": productCategoryId.value!,
        "height": productHeight.value!,
        "weight": productWeight.value!,
        "diameter": productDiameter.value!,
        "priceWithoutVAT": productPriceWithoutVAT.value!,
        "productionCost": productProductionCost.value!
    }
    const addedProductDTO = productsStore.addProduct(auxProduct);
    console.log(addedProductDTO);
}
</script>

<template>
<div class="form">
    <form @submit.prevent>
        <label for="product-name">Name
            <input type="text" id="product-name" v-model="productName" :required="productName === undefined">
        </label>
        <label for="product-height">Height
            <input type="number" id="product-height" required v-model="productHeight">
        </label>
        <label for="product-diameter"> Diameter
            <input type="number" id="product-diameter" required v-model="productDiameter">
        </label>
        <label for="product-diameter"> Weight
            <input type="number" id="product-weight" required v-model="productWeight">
        </label>
        <label for="product-production-cost"> Production Cost
            <input type="number" id="product-production-cost" required v-model="productPriceWithoutVAT">
        </label> Price Without V.A.T.
        <label for="product-price-without-vat">
            <input type="number" id="product-price-without-vat" required v-model="productProductionCost">
        </label>
        <SearchSelect
            class="search-select"
            :options="categories"
            @send-option="getSelectedCategory"
        ></SearchSelect>
        <button 
            type="submit"
            @click="addProduct"
        >Add Product</button>
    </form>
</div>
</template>

<style scoped>
.form {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    width: 50px;
}

.search-select { 
    justify-content: center;
    align-items: center;
}
</style>