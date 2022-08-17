<script setup lang="ts">
import { Product } from '@/types/ProductTypes';
import SearchSelect from '@/components/controls/SearchSelect.vue';
import { SearchSelectOption } from '@/types/UtilsTypes';
import { getProductCategoriesWithoutPagination } from '@/services/ProductCategoryService';
import { computed, ref } from 'vue';
import { useProductsStore } from '@/stores/ProductsStore';
import InputString from '@/components/controls/InputString.vue';
import InputNumber from '@/components/controls/InputNumber.vue';
import SubmitButton from '../buttons/SubmitButton.vue';
import SimpleButton from '../buttons/SimpleButton.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps<{
    updatedProduct?: Product
}>();

const emits = defineEmits<{
    (e: 'form-submitted'): void
}>();

const productsStore = useProductsStore();

const categories = ref<SearchSelectOption[]>([]);
const name = ref<string>(props.updatedProduct?.name || "");
const height = ref<number | null>(props.updatedProduct?.productSizes.height || null);
const diameter = ref<number| null>(props.updatedProduct?.productSizes.diameter || null);
const weight = ref<number | null>(props.updatedProduct?.productSizes.weight || null);
const priceWithoutVAT = ref<number| null>(props.updatedProduct?.productPrices.priceWithoutVAT || null);
const productionCost = ref<number | null>(props.updatedProduct?.productPrices.productionCost || null);
const categoryId = ref<number| null>(props.updatedProduct?.productCategory.id || null);
const categoryFilterText = ref<string>(props.updatedProduct?.productCategory.categoryName || "");

const isSubmitButtonDisabled = computed(() => name.value === "" && height.value === null && diameter.value === null 
    && weight.value === null && priceWithoutVAT.value === null && productionCost.value === null && categoryFilterText.value === "");

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

function updateSelectedCategory(selectedCategory: SearchSelectOption) {
    categoryId.value = selectedCategory.id.valueOf();
}

function saveProduct() {
    const auxProduct = {
        "name": name.value!,
        "productCategoryId": categoryId.value!,
        "height": height.value!,
        "weight": weight.value!,
        "diameter": diameter.value!,
        "priceWithoutVAT": priceWithoutVAT.value!,
        "productionCost": productionCost.value!
    }
    if (props.updatedProduct) {
        productsStore.updateProduct(props.updatedProduct.id, auxProduct);
    } else {
        productsStore.addProduct(auxProduct);
    }
    emits('form-submitted');    
}

function clearFields() {
    name.value = "";
    categoryFilterText.value = "";
    height.value = null;
    diameter.value = null;
    weight.value = null;
    priceWithoutVAT.value = null;
    productionCost.value = null;
}
</script>

<template>
<div class="product-form-container">
    <form @submit.prevent>
        <div class="name-and-category-section">
            <span class="section-label">Name & Category</span>
            <InputString
                class="name-input-field"
                label="Name"
                :required="true"
                v-model="name"
            />
            <SearchSelect
                class="search-select"
                :options="categories"
                label="Select Category"
                :required="true"
                v-model="categoryFilterText"
                @send-option="updateSelectedCategory"
            />
        </div>
        <div class="sizes-section">
            <span class="section-label">Sizes</span>
            <InputNumber
                label="Height"
                :required="true"
                unit-measure="cm"
                v-model="height"
            />
            <InputNumber
                label="Diameter"
                :required="true"
                unit-measure="cm"
                v-model="diameter"
            />
            <InputNumber
                label="Weight"
                :required="true"
                unit-measure="g"
                v-model="weight"
            />
        </div>
        <div class="prices-section">
            <span class="section-label">Prices</span>
            <InputNumber
                label="Production Cost"
                :required="true"
                unit-measure="RON"
                v-model="productionCost"
            />
            <InputNumber
                label="Price without V.A.T"
                :required="true"
                unit-measure="RON"
                v-model="priceWithoutVAT"
            />
        </div>
        <div class="cancel-button-wrapper">
            <SimpleButton
                class="cancel-button"
                label="Cancel"
                @click="router.back()"
            />
        </div>
        <div class="add-button-wrapper">
            <SubmitButton
                class="add-button"
                label="Save"
                :is-disabled="isSubmitButtonDisabled"
                @submit="saveProduct"
            />
        </div>
        <div class="clear-button-wrapper">
            <SimpleButton
                class="clear-button"
                label="Clear All"
                @click="clearFields"
            />
        </div>
    </form>
</div>
</template>

<style lang="less" scoped>
@import "@/assets/colors.less";

.product-form-container {
    height: 100%;
    width: 100%;
    border-radius: 5px;
    border: 1px solid #efefef;
    background-color: white;
    box-shadow: 2px 2px 2px 2px #959da0;
}
form {
    height: 100%;
    box-sizing: border-box;
    display: grid;
    grid-auto-flow: row;
    grid-auto-rows: 1fr;
}
.name-and-category-section, .sizes-section {
    border-bottom: 1px solid #9e9d9d;
}
.name-and-category-section, .sizes-section, .prices-section {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    > * {
        // flex-grow: 1;
        flex-basis: 50%;
    }
}

.sizes-section, .prices-section {
    justify-content: space-around;
    > * {
        flex-basis: auto;
    }
}

.prices-section {
    justify-content: space-evenly;
}
.section-label {
    position: absolute;
    color: grey;
    top: 2%;
    left: 1%;    
}
.name-input-field {
    position: relative;
    padding: 5px 45px 5px 45px;
}
.add-button-wrapper {
    position: absolute;
    bottom: 5%;
    right: 5%;
}
.clear-button, .cancel-button, .add-button {
    width: 6rem;
    height: 1.75rem;
    font-size: 1.05rem;
    font-weight: 500;
    border: 1px solid black;
    border-radius: 0.3rem;
    &:hover {
        box-shadow: inset .01rem .01rem 0rem .05rem black;
    }
}
.add-button {
    background-color: @custom-green;
    &:disabled {
        border-color: transparent;
        color: white;
        box-shadow: none;
        opacity: 0.5;
    }
}
.cancel-button-wrapper {
    position: absolute;
    bottom: 5%;
    right: 18%;
}

.cancel-button {
    background-color: #a9b2bd;
}
.clear-button-wrapper {
    position: absolute;
    bottom: 5%;
    left: 5%;
}
.clear-button {
    background-color: @custom-blue;
}

</style>