<script setup lang="ts">
import Pagination from '@/components/Pagination.vue';
import SearchBar from '@/components/SearchBar.vue';
import SelectItem from '@/components/SelectItem.vue';
import { useProductsStore } from '@/stores/ProductsStore';
import { ProductsData } from '@/Types/ProductTypes';
import { APIUrls } from '@/utils/Utils';
import { computed } from '@vue/reactivity';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const productsStore = useProductsStore();
const router = useRouter();
/** Variables declaration. */
const showProducts = ref(true);

const showSizes = ref(true);
const toggleSizesLabel = computed(() => showSizes.value === true ? "Show Prices" : "Show Sizes");
const categoryFilterId = ref(-1);

const pageNo = ref(0);
const pageSize = ref(15);
const sortBy = ref("name");
const sortDir = ref("asc");

const getProductsURL = computed(() => {
    let url: string;
    if (categoryFilterId.value !== -1) {
        url = APIUrls.API_PRODUCT_ROOT + "/category/" + categoryFilterId.value + "?pageNo=" + pageNo.value + "&pageSize=" + pageSize.value + "&sortBy=" + sortBy.value + "&sortDir=" + sortDir.value;
    } else {
        url = APIUrls.API_PRODUCT_ROOT + "?pageNo=" + pageNo.value + "&pageSize=" + pageSize.value + "&sortBy=" + sortBy.value + "&sortDir=" + sortDir.value;
    }
    return url;
})

const pagesNumbers = ref<number[]>([]);
const pageSizeOptions = ["5", "10", "15"];

let productsData = ref<ProductsData>();
let productsCategories = ref<string[]>([]);

(await updateProductsData());
(await updateProductsCategoriesNames());

/** Functions implemntation. */

async function updateProductsData() {
    productsData.value = (await productsStore.fetchProducts(getProductsURL.value));
    updatePagesNumbers(productsData.value.totalPages);
}

async function updateProductsCategoriesNames() {
    productsCategories = (await productsStore.fetchProductsCategoriesNames());
    productsCategories.value.unshift("All");
}

function updatePagesNumbers(totalPages: number) {
    pagesNumbers.value = [];
    for (let i = 1; i <= totalPages; i++) {
        pagesNumbers.value.push(i);
    }
}

function updatePageSize(newPageSize: string) {
    pageSize.value = parseInt(newPageSize);
}

function updatePageNumber(newPageNumber: number) {
    pageNo.value = newPageNumber - 1; // substract 1 because the page number on server side is 0 index based.
}

function search(searchedText: string) {
    // TODO implement search feature
}

async function updateCategoryFilter(selectedCategory: string) {
    if (selectedCategory === "All") {
        categoryFilterId.value = -1;
    } else {
        const categoryId = (await productsStore.getCategoryIdFromName(selectedCategory));
        categoryFilterId.value = categoryId;
    }
}

function toggleSizes() {
    showSizes.value = !showSizes.value;
}

function sortByName() {
    sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
    const nameColumnHeader = document.getElementById("name-th");
    if (nameColumnHeader !== null) {
        if (sortDir.value === "desc") {
            nameColumnHeader.classList.remove("header-sort-up");
            nameColumnHeader.classList.add("header-sort-down");
        } else {
            nameColumnHeader.classList.remove("header-sort-down");
            nameColumnHeader.classList.add("header-sort-up");            
        }
    }
}

function goToAddPage() {
    let url = "/products/add-product";
    router.push(url);
}

function goToUpdatePage(updatedProductId: number) {
    let url = "/products/update-product/" + updatedProductId;
    router.push(url);
}

/** Update the products data, and page numbers, every time pageNo, pageSize, sortDir, sortBy variables modifies. */
watch(getProductsURL, async () => {
    productsData.value = (await productsStore.fetchProducts(getProductsURL.value));
    updatePagesNumbers(productsData.value.totalPages);
});
</script>

<template>
<div class="products-view">
    <header class="header">All Products</header>
    <main>
        <div class="container">
            <div class="controls-container">
                <SearchBar 
                    class="search-bar"
                    @search-text="search"
                ></SearchBar>
                <SelectItem
                    class="select-page-size-dropdown"
                    :options=pageSizeOptions
                    :default-option="pageSize.toString()"
                    @update-value="updatePageSize"
                ></SelectItem>
                <SelectItem
                    class="select-product-category"
                    :options=productsCategories
                    @update-value="updateCategoryFilter"
                ></SelectItem>
                <span class="toggle-sizes" @click="toggleSizes">{{toggleSizesLabel}}</span>
                <button @click="goToAddPage">Add product</button>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th id="name-th" class="header-sort-up" @click="sortByName">Name</th>
                            <th>Category</th>
                            <th v-if="showSizes">Height (cm)</th>
                            <th v-else>Production Cost (RON)</th>
                            <th v-if="showSizes">Diameter (cm)</th>
                            <th v-else>Price Without V.A.T. (RON)</th>
                            <th v-if="showSizes">Weight (g)</th>
                            <th v-else>Final Price (RON)</th>
                            <th colspan="2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="product in productsData!.content" :key="product.id">
                            <td>{{product.name}}</td>
                            <td>{{product.productCategory.categoryName}}</td>
                            <td class="numerical-cell" v-if="showSizes">{{product.productSizes.height}}</td>
                            <td class="numerical-cell" v-else>{{product.productPrices.productionCost}}</td>
                            <td class="numerical-cell" v-if="showSizes">{{product.productSizes.diameter}}</td>
                            <td class="numerical-cell" v-else>{{product.productPrices.priceWithoutVAT}}</td>
                            <td class="numerical-cell" v-if="showSizes">{{product.productSizes.weight}}</td>
                            <td class="numerical-cell" v-else>{{product.productPrices.finalPrice}}</td>
                            <td class="actions-cell" @click="goToUpdatePage(product.id)">Update</td>
                            <td class="actions-cell">Delete</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Pagination
                class="products-pagination"
                :pages="pagesNumbers"
                :page-number="pageNo"
                :last="productsData?.last"
                @update-page="updatePageNumber"
            ></Pagination>
        </div>
    </main>
</div>
</template>

<style scoped>
.products-view {
    height: 100%;
}
.header {
    height: 10%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: xx-large;
}

main {
    height: 90%;
}
.container {
    height: 80%;
    width: 80%;
    position: fixed;
    top: 10%;
    left: 10%;
    right: 10%;
    bottom: 10%;
    padding: 1%;
}

.table-container {
    position: relative;
    padding: 1%;
    max-height: 80vh;
}

.search-bar {
    margin-left: 1%;
    width: 70%;
}

table {
    table-layout: fixed;
    border-collapse: collapse;
    width: 100%;
    height: 100%;
    border: 1px solid;
}

thead {
    border-bottom: 1px solid;
}

th {
    border-right: 1px solid;
    padding: 1%;
}

.header-sort-down::after, .header-sort-up::after {
    content: ' ';
    position: relative;
    left: 10px;
    border: 7px solid transparent;
}
.header-sort-down::after {
    top: 10px;
    border-top-color: silver;
}
.header-sort-up::after {
    bottom: 15px;
    border-bottom-color: silver;
}
.header-sort-down,
.header-sort-up {
    padding-left: 20px;
}
td {
    padding: 0.5%;
    text-align: left;
    border-bottom: 1px solid;
    border-right: 1px solid;
    font-weight: lighter;
}

tbody tr:nth-child(odd) {
  background-color: rgb(212, 207, 207);
}

tbody tr:nth-child(even) {
  background-color: rgb(238, 232, 232);
}

.numerical-cell {
    text-align: right;
    font-variant-numeric: tabular-nums;
}

.actions-cell {
    text-align: center;
}

.toggle-sizes {
    cursor: pointer;
}

.products-pagination {
    display: flex;
    justify-content: center;
}
</style>