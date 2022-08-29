<script setup lang="ts">
import ActionButton from '@/components/buttons/ActionButton.vue';
import SimpleButton from '@/components/buttons/SimpleButton.vue';
import SwitchButton from '@/components/buttons/SwitchButton.vue';
import PageSizeIconsOptions from '@/components/controls/PageSizeIconsOptions.vue';
import Pagination from '@/components/controls/Pagination.vue';
import SearchBar from '@/components/controls/SearchBar.vue';
import SelectItem from '@/components/controls/SelectItem.vue';
import CustomModal from '@/components/visual/CustomModal.vue';
import { useIsCurrentUserSupervisor } from '@/composables/rolesComposables';
import { useRemoveElement } from '@/composables/useRemoveElement';
import { useProductsStore } from '@/stores/ProductsStore';
import { ProductsData } from '@/types/ProductTypes';
import { PaginationParams } from '@/types/UtilsTypes';
import { APIUrls } from "@/utils/APIURLs";
import paginationParamsDefaults from "@/utils/PaginationParamsDefaults";
import { SizeType } from '@/utils/Utils';
import { computed, reactive } from '@vue/reactivity';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const productsStore = useProductsStore();
const router = useRouter();
/** Variables declaration. */

const showSizes = ref(true);
const categoryFilterId = ref(-1);
const currentCategory = ref("All");

const productToBeDeletedId = ref<number>();
const productToBeDeletedName = ref<string>();
const isDeleteModalDisplayed = ref(false);

const paginationParams = reactive<PaginationParams>({...paginationParamsDefaults});
paginationParams.pageSize = 15;

const searchText = ref("");

const isCurrentUserSupervisor = useIsCurrentUserSupervisor();

const getProductsURL = computed(() => {
    let url: string = APIUrls.API_PRODUCTS_ROOT + "?pageNo=" + paginationParams.pageNo + "&pageSize=" + paginationParams.pageSize + "&sortBy=" + paginationParams.sortBy + "&sortDir=" + paginationParams.sortDir;;
    if (categoryFilterId.value !== -1) {
        url = APIUrls.API_PRODUCTS_ROOT + "/category/" + categoryFilterId.value + "?"; 
        if (searchText.value !== "") {
            url += "keyword=" + searchText.value + "&";
        }
        url += "pageNo=" + paginationParams.pageNo + "&pageSize=" + paginationParams.pageSize + "&sortBy=" + paginationParams.sortBy + "&sortDir=" + paginationParams.sortDir;
    } else if (searchText.value.trim() !== "") {
        url = APIUrls.API_PRODUCTS_ROOT + "/search?keyword=" + searchText.value + "&pageNo=" + paginationParams.pageNo + "&pageSize=" + paginationParams.pageSize + "&sortBy=" + paginationParams.sortBy + "&sortDir=" + paginationParams.sortDir;    
    }
    return url;
});

const pagesNumbers = ref<number[]>([]);

let productsData = ref<ProductsData>();
let productsCategories = ref<string[]>([]);

const isTableEmpty = computed(() => {
    let isEmpty = true;
    if (productsData.value !== undefined) {
        if (productsData.value.content.length > 0) {
            isEmpty = false;
        }
    }
    return isEmpty;
});

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
            paginationParams.pageSize = 15;
            break;
        case SizeType.MEDIUM:
            paginationParams.pageSize = 10;
            break;
        case SizeType.LARGE:
            paginationParams.pageSize = 5;
            break;
        default:
            paginationParams.pageSize = 15;
    }
}

function updatePageNumber(newPageNumber: number) {
    paginationParams.pageNo = newPageNumber - 1; // substract 1 because the page number on server side is 0 index based.
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
    paginationParams.sortDir = paginationParams.sortDir === "asc" ? "desc" : "asc";
    const nameColumnHeader = document.getElementById("name-th");
    if (nameColumnHeader !== null) {
        if (paginationParams.sortDir === "desc") {
            nameColumnHeader.classList.remove("header-sort-up");
            nameColumnHeader.classList.add("header-sort-down");
        } else {
            nameColumnHeader.classList.remove("header-sort-down");
            nameColumnHeader.classList.add("header-sort-up");            
        }
    }
}

function goToAddPage() {
    const url = "/products/add-product";
    router.push(url);
}

function goToUpdatePage(id: number) {
    const url = "/products/update-product/" + id;
    router.push(url);
}

async function deleteProduct(id: number) {
    await productsStore.deleteProductById(id);
    updateProductsData();
    hideDeleteModal();
    if (productsData.value?.content) {
        const index = getIndexById(id);
        productsData.value.content = useRemoveElement(index, productsData.value.content);
    }
}

function displayDeleteModal(id: number, name: string) {
    productToBeDeletedId.value = id;
    productToBeDeletedName.value = name;
    isDeleteModalDisplayed.value = true;
}

function hideDeleteModal() {
    isDeleteModalDisplayed.value = false;
}

function getIndexById(id: number) {
    let finalIndex: number = -1;
    productsData.value?.content.forEach((element, index) => {
        if (element.id === id) {
            finalIndex = index;
        }
    })
    return finalIndex;
}

watch(currentCategory, async (newCategory) => {
    if (newCategory === "All") {
        categoryFilterId.value = -1;
    } else {
        const categoryId = (await productsStore.getCategoryIdFromName(newCategory));
        categoryFilterId.value = categoryId;
    }
})

/** Update the products data, and page numbers, every time pageNo, pageSize, sortDir, sortBy variables modifies. */
watch(getProductsURL, async () => {
    updateProductsData();
}); 
</script>

<template>
<div class="products-home">
    <main>
        <div class="container">
            <div class="controls-container">
                <SearchBar 
                    class="search-bar"
                    v-model="searchText"
                    placeholder="Search by name"
                />
                <SelectItem
                    class="select-product-category"
                    v-model="currentCategory"
                    :options=productsCategories
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
                <ActionButton
                    class="add-button"
                    label="New Product"
                    action-type="add"
                    :disabled="isCurrentUserSupervisor === false"
                    @click="goToAddPage"
                />
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
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
                            <th v-if="isCurrentUserSupervisor === true" class="actions-header" colspan="2"></th>
                        </tr>
                    </thead>
                    <tbody v-if="isTableEmpty === false">
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
                            <td v-if="isCurrentUserSupervisor === true" class="action-cell">
                                <div class="edit-cell-content-wrapper" @click="goToUpdatePage(product.id)">
                                    <span 
                                        class="material-symbols-outlined edit" 
                                        @click="goToUpdatePage(product.id)"
                                    >
                                        edit
                                    </span>
                                    <span class="icon-label">Edit</span> 
                                </div>
                            </td>
                            <td v-if="isCurrentUserSupervisor === true" class="action-cell">
                                <div class="delete-cell-content-wrapper" @click="displayDeleteModal(product.id, product.name)"> 
                                    <span 
                                        class="material-symbols-outlined delete"
                                        @click="displayDeleteModal(product.id, product.name)"
                                    >
                                        delete
                                    </span>
                                    <span class="icon-label">Delete</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                    <tr>
                        <td  
                            colspan="8"
                            class="no-colors-available-label"
                        >
                            No Products Available.
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>
            <Pagination
                v-if="isTableEmpty === false"
                class="products-pagination"
                :page-no="productsData!.pageNo"
                :page-size="productsData!.pageSize"
                :last="productsData!.last"
                :total-elements="productsData!.totalElements"
                :total-pages="productsData!.totalPages"
                @update-page="updatePageNumber"
            />
        </div>
    </main>
    <div class="delete-product-modal">
        <Teleport to="#modals">
            <CustomModal 
                :display="isDeleteModalDisplayed"
                @x-button-click="hideDeleteModal"
            >
                <template #title>
                    <h2>Delete product <div class="deleted-product-name">{{productToBeDeletedName}}</div>?</h2>
                </template>
                <template #cancel-button>
                    <SimpleButton 
                        class="no-button"
                        label="No"
                        @click="hideDeleteModal"
                    />
                </template>
                <template #ok-button>
                    <SimpleButton 
                        class="ok-button"
                        label="Ok"
                        @click="deleteProduct(productToBeDeletedId!)"
                    />
                </template>
            </CustomModal>
        </Teleport>
    </div>
</div>

</template>

<style scoped lang="less">
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0");
@import "@/assets/colors.less";

.products-home {
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
    margin-top: 1rem;
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

.add-button {
    background-color: @custom-green;//#77b994;
    // color: white;
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
    background-color: @custom-green;//#77b994;
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

.action-cell {
    text-align: center;
    // margin: 0 auto;
}
.delete-button, .edit-button {
    margin: 0 auto;
    text-align: center;
    border: none;
    background-color: inherit;
    &:hover {
        border: none;
        box-shadow: none;
    }
}
.delete-button {
    // color: @custom-red;
    & .material-symbols-outlined {
        font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 48;
        font-size: 22px;
        cursor: pointer;
        color: @custom-red;
    }
}
.edit-button {
    // color: @custom-yellow;
    .material-symbols-outlined {
        font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 48;
        font-size: 22px;
        cursor: pointer;
        color: #fde047;
    }
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

.deleted-product-name {
    display: inline;
    color: @custom-blue;
}
.ok-button {
    width: 5rem;
    height: 2rem;
    background-color: #1e3a8a;
    font-weight: 600;
    &:hover {
        background-color: #2563eb;
    }
}
.no-button {
    background-color: @custom-green;
    width: 5rem;
    height: 2rem;
    font-weight: 600;
}
.no-colors-available-label {
    text-align: center;
    font-size: 1.7rem;
}
</style>