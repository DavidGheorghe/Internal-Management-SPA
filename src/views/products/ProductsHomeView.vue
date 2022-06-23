<script setup lang="ts">
import AddButton from '@/components/buttons/AddButton.vue';
import SwitchButton from '@/components/buttons/SwitchButton.vue';
import PageSizeIconsOptions from '@/components/controls/PageSizeIconsOptions.vue';
import Pagination from '@/components/controls/Pagination.vue';
import SearchBar from '@/components/controls/SearchBar.vue';
import SelectItem from '@/components/controls/SelectItem.vue';
import CustomModal from '@/components/visual/CustomModal.vue';
import SimpleButton from '@/components/buttons/SimpleButton.vue';
import XButton from '@/components/buttons/XButton.vue';
import { useProductsStore } from '@/stores/ProductsStore';
import { ProductsData } from '@/Types/ProductTypes';
import { APIUrls, SizeType } from '@/utils/Utils';
import { computed } from '@vue/reactivity';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const productsStore = useProductsStore();
const router = useRouter();
/** Variables declaration. */

const showSizes = ref(true);
const categoryFilterId = ref(-1);

const pageNo = ref(0);
const pageSize = ref(15);
const sortBy = ref("name");
const sortDir = ref("asc");
const searchText = ref("");

const getProductsURL = computed(() => {
    let url: string = APIUrls.API_PRODUCT_ROOT + "?pageNo=" + pageNo.value + "&pageSize=" + pageSize.value + "&sortBy=" + sortBy.value + "&sortDir=" + sortDir.value;;
    if (categoryFilterId.value !== -1) {
        url = APIUrls.API_PRODUCT_ROOT + "/category/" + categoryFilterId.value + "?pageNo=" + pageNo.value + "&pageSize=" + pageSize.value + "&sortBy=" + sortBy.value + "&sortDir=" + sortDir.value;
    }
    if (searchText.value !== "") {
        url = APIUrls.API_PRODUCT_ROOT + "/search?keyword=" + searchText.value + "&pageNo=" + pageNo.value + "&pageSize=" + pageSize.value + "&sortBy=" + sortBy.value + "&sortDir=" + sortDir.value;    
    }
    return url;
})

const pagesNumbers = ref<number[]>([]);

let productsData = ref<ProductsData>();
let productsCategories = ref<string[]>([]);

// const filteredProducts = computed(() => productsData.value?.content.filter((product) => product.name.includes(searchText.value)));

(await updateProductsData());
(await updateProductsCategoriesNames());

/** Functions. */

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

function updatePageSize(sizeOption: SizeType) {
    switch (sizeOption) {
        case SizeType.SMALL:
            pageSize.value = 15;
            break;
        case SizeType.MEDIUM:
            pageSize.value = 10;
            break;
        case SizeType.LARGE:
            pageSize.value = 5;
            break;
        default:
            pageSize.value = 15;
    }
}

function updatePageNumber(newPageNumber: number) {
    pageNo.value = newPageNumber - 1; // substract 1 because the page number on server side is 0 index based.
}

function search(searchedText: string) {
    searchText.value = searchedText;
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
    const addProductPageURL = "/products/add-product";
    router.push(addProductPageURL);
}

function goToUpdatePage(updatedProductId: number) {
    const editProductPageURL = "/products/update-product/" + updatedProductId;
    router.push(editProductPageURL);
}

function goToDeletePage(deletedProductId: number) {
    const deleteProductPageURL = "/products/delete-product/" + deletedProductId;
    router.push(deleteProductPageURL);
}

/** Update the products data, and page numbers, every time pageNo, pageSize, sortDir, sortBy variables modifies. */
watch(getProductsURL, async () => {
    productsData.value = (await productsStore.fetchProducts(getProductsURL.value));
    updatePagesNumbers(productsData.value.totalPages);
});
</script>

<template>

<div class="products-view">
    <main>
        <div class="container">
            <div class="controls-container">
                <SearchBar 
                    class="search-bar"
                    @search-text="search"
                />
                <SelectItem
                    class="select-product-category"
                    :options=productsCategories
                    :default-option="'Choose Category'"
                    @update-value="updateCategoryFilter"
                />
                <SwitchButton
                    class="switch-sizes-prices-button"
                    first-option="Prices"
                    second-option="Sizes"
                    :default-option-index=1
                    @send-option="toggleSizes"
                />
                <PageSizeIconsOptions
                    class="select-page-size"
                    @selected-option="updatePageSize"
                />
                <AddButton
                    class="add-product-button"
                    label="New Product"
                    @click="goToAddPage"
                />
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th 
                                id="name-th" 
                                class="header-sort-up" 
                                @click="sortByName"
                            >Name</th>
                            <th>Category</th>
                            <th class="numerical-cell-header" v-if="showSizes">Height (cm)</th>
                            <th class="numerical-cell-header prices" v-else>Production Cost (RON)</th>
                            <th class="numerical-cell-header" v-if="showSizes">Diameter (cm)</th>
                            <th class="numerical-cell-header prices" v-else>Price Without V.A.T. (RON)</th>
                            <th class="numerical-cell-header" v-if="showSizes">Weight (g)</th>
                            <th class="numerical-cell-header prices" v-else>Final Price (RON)</th>
                            <th class="actions-header" colspan="2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="product in productsData?.content" :key="product.id">
                            <td>{{product.id}}</td>
                            <td class="name">{{product.name}}</td>
                            <td>{{product.productCategory.categoryName}}</td>
                            <td class="numerical-cell" v-if="showSizes">{{product.productSizes.height}}</td>
                            <td class="numerical-cell" v-else>{{product.productPrices.productionCost}}</td>
                            <td class="numerical-cell" v-if="showSizes">{{product.productSizes.diameter}}</td>
                            <td class="numerical-cell" v-else>{{product.productPrices.priceWithoutVAT}}</td>
                            <td class="numerical-cell" v-if="showSizes">{{product.productSizes.weight}}</td>
                            <td class="numerical-cell" v-else>{{product.productPrices.finalPrice}}</td>
                            <td class="edit-cell">
                                <div class="edit-cell-content-wrapper">
                                    <span 
                                        class="material-symbols-outlined edit" 
                                        @click="goToUpdatePage(product.id)"
                                    >edit</span>
                                    <span class="icon-label">Edit</span> 
                                </div>
                            </td>
                            <td class="delete-cell">
                                <div class="delete-cell-content-wrapper">
                                    <span 
                                        class="material-symbols-outlined delete"
                                        @click="goToDeletePage(product.id)"
                                    >delete</span>
                                    <span class="icon-label">Delete</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Pagination
                class="products-pagination"
                :pages="pagesNumbers"
                :page-number="pageNo"
                :page-no="pageNo"
                :page-size="productsData!.pageSize"
                :last="productsData!.last"
                :total-elements="productsData!.totalElements"
                :total-pages="productsData!.totalPages"
                @update-page="updatePageNumber"
            />
        </div>
    </main>
    <div class="delete-product-modal" v-if="false">
        <Teleport to="#modals">
            <CustomModal>
                <template
                    #x-button
                    class="modal-x-button"
                >
                    <XButton @click="router.back"/>
                </template>
                <template #title>
                    <h2>Delete product </h2>
                </template>
                <template #ok-button>
                    <SimpleButton 
                        class="ok-button"
                        label="Ok"
                        @click="router.back"
                    />
                </template>
            </CustomModal>
        </Teleport>
    </div>
</div>

</template>

<style scoped lang="less">
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0");

.products-view {
    height: 100%;
    background-color:#efefef;
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
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 5px;
    box-shadow: 2px 2px 2px 2px #959da0;
}

.controls-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 1%;
    height: 10%;
}

.search-bar {
    margin-left: 1%;
    width: 50%;
    height: 50%;
}

.select-page-size {
    height: 35%;
}

.select-product-category {
    height: 30%;
}

.switch-sizes-prices-button {
    height: 40%;
}

.add-product-button {
    background-color: #22c55e;//#77b994;
    color: white;
    height: 40%;
}

table {
    table-layout: auto;
    border-collapse: collapse;
    width: 100%;
    height: 100%;
    box-shadow: 2px 2px 2px 2px whitesmoke;
}

.table-container {
    position: relative;
    padding: 1%;
    max-height: 80vh;
}

thead {
    background-color: #22c55e;//#77b994;
    color: black;
}

th {
    padding: 0.3% 0.2% 0.3% 0.2%;
    font-size: 1.1rem;//20px;
}

.header-sort-down::after, .header-sort-up::after {
    content: ' ';
    position: relative;
    left: 8px;
    border: 7px solid transparent;
    cursor: pointer;
}
.header-sort-down::after {
    top: 15px;
    border-top-color: black; //silver;
}
.header-sort-up::after {
    bottom: 15px;
    border-bottom-color:black;// silver;
}
.header-sort-down,
.header-sort-up {
    padding-left: 20px;
}
td {
    padding: 0.5%;
    text-align: left;
    font-weight: 490;
    font-size: 1.1rem;//18px;
    &.name {
        padding-left: 1%;
    }
}

tbody tr {
    border-bottom: 1px solid rgb(215, 209, 209);
}

tbody tr:nth-child(odd) {
    background-color: #efefef;
}

.numerical-cell-header {
    width: 7%;
    line-break: normal;
    font-size: 1rem;
    &.prices {
        font-size: 0.95rem;
    }
}

.numerical-cell {
    text-align: right;
    font-variant-numeric: proportional-nums;
}
.edit-cell, .delete-cell {
    &-content-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}

.actions-cell {
    text-align: center;
    margin: 0 auto;
}

.products-pagination {
    height: 5%;
}

.material-symbols-outlined {
    font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 48;
    font-size: 22px;
    cursor: pointer;
    &.edit {
        color: #fde047;
    }
    &.delete {
        color: #dc2626;
    }
}
</style>