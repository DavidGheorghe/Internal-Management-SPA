<script setup lang="ts">
import { Product } from '@/Types/ProductTypes';
import SearchSelect from '@/components/controls/SearchSelect.vue';
import { SearchSelectOption } from '@/Types/GenericArrayType';
import { getProductCategoriesWithoutPagination } from '@/services/ProductCategoryService';
import { ref } from 'vue';
import { useProductsStore } from '@/stores/ProductsStore';
import InputString from '@/components/controls/InputString.vue';
import InputNumber from '@/components/controls/InputNumber.vue';

defineProps<{
    updatedProduct?: Product
}>();

const productsStore = useProductsStore();

const categories = ref<SearchSelectOption[]>([]);
const name = ref<string>();
const height = ref<number>();
const diameter = ref<number>();
const weight = ref<number>();
const priceWithoutVAT = ref<number>();
const productionCost = ref<number>();
const categoryId = ref<number>();


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

function getSelectedCategory(selectedCategory: SearchSelectOption) {
    categoryId.value = selectedCategory.id.valueOf();
}

function updateName(newName: string) {
    name.value = newName;
}

function updateHeight(newHeight: number) {
    height.value = newHeight;
}

function updateDiameter(newDiameter: number) {
    diameter.value = newDiameter;
}

function updateWeight(newWeight: number) {
    weight.value = newWeight;
}

function updateProductionCost(newProductionCost: number) {
    productionCost.value = newProductionCost;
}

function updatePriceWithoutVAT(newPriceWithoutVAT: number) {
    priceWithoutVAT.value = newPriceWithoutVAT;
}

function addProduct() {
    const auxProduct = {
        "name": name.value!,
        "productCategoryId": categoryId.value!,
        "height": height.value!,
        "weight": weight.value!,
        "diameter": diameter.value!,
        "priceWithoutVAT": priceWithoutVAT.value!,
        "productionCost": productionCost.value!
    }
    const addedProductDTO = productsStore.addProduct(auxProduct);
    // console.log(addedProductDTO);
}
</script>

<template>
<div class="product-form-container">
    <form @submit.prevent>
        <!-- <label for="product-name">Name
            <input type="text" id="product-name" v-model="productName" :required="productName === undefined">
        </label> -->
        <div class="name-and-category-section">
            <span>Name & Category</span>
            <InputString
            class="name-input-field"
            label="Name"
            :required="true"
            @send-value="updateName"
            ></InputString>
            <SearchSelect
                class="search-select"
                :options="categories"
                label="Select Category"
                @send-option="getSelectedCategory"
            ></SearchSelect>
        </div>
        <!-- <label for="product-height">Height
            <input type="number" id="product-height" required v-model="productHeight">
        </label> -->
        <div class="sizes-section">
            <span>Sizes</span>
            <InputNumber
            label="Height"
            :required="true"
            unit-measure="cm"
            @send-value="updateHeight"
            ></InputNumber>
            <InputNumber
                label="Diameter"
                :required="true"
                unit-measure="cm"
                @send-value="updateDiameter"
            ></InputNumber>
            <InputNumber
                label="Weight"
                :required="true"
                unit-measure="g"
                @send-value="updateWeight"
            ></InputNumber>
        </div>
        <div class="prices-section">
            <span>Prices</span>
            <InputNumber
                label="Production Cost"
                :required="true"
                unit-measure="RON"
                @send-value="updateProductionCost"
            ></InputNumber>
            <InputNumber
                label="Price without V.A.T"
                :required="true"
                unit-measure="RON"
                @send-value="updatePriceWithoutVAT"
            ></InputNumber>
        </div>
        <div class="add-button">
            <button 
                type="submit"
                @click="addProduct"
            >Add Product</button>
        </div>
    </form>
</div>
</template>

<style lang="less" scoped>
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
.search-select {
    justify-content: center;
    align-items: center;
    position: relative;
}

.name-input-field {
    position: relative;
    padding: 5px 45px 5px 45px;
}

.name-and-category-section {
    & span {
        position: absolute;
        color: grey;
        top: 1%;
        left: 1%;
    }
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    > * {
        flex-grow: 1;
    }
}
.name-and-category-section, .sizes-section {
    border-bottom: 1px solid #9e9d9d;
}
.add-button {
    /* height: 10%; */
    position: absolute;
    bottom: 5%;
    right: 5%;
}
</style>