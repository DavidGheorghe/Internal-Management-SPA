<script setup lang="ts">
import { Product } from '@/Types/ProductTypes';
import SearchSelect from '@/components/controls/SearchSelect.vue';
import { SearchSelectOption } from '@/Types/GenericArrayType';
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
const height = ref<number>(props.updatedProduct?.productSizes.height || NaN);
const diameter = ref<number>(props.updatedProduct?.productSizes.diameter || NaN);
const weight = ref<number>(props.updatedProduct?.productSizes.weight || NaN);
const priceWithoutVAT = ref<number>(props.updatedProduct?.productPrices.priceWithoutVAT || NaN);
const productionCost = ref<number>(props.updatedProduct?.productPrices.productionCost || NaN);
const categoryId = ref<number>(props.updatedProduct?.productCategory.id || NaN);
const categoryFilterText = ref<string>(props.updatedProduct?.productCategory.categoryName ||"");

const isSubmitButtonDisabled = computed(() => name.value !== "" && height.value !== 0 && diameter.value !== 0 && weight.value !== 0 && priceWithoutVAT.value !== 0 && productionCost.value !== 0 && categoryId.value !== 0);

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
        // productsStore.updateProduct(props.updatedProduct.id, auxProduct);
    } else {
    //    productsStore.addProduct(auxProduct);
    }
    emits('form-submitted');    
}

function clearFields() {
    name.value = "";
    categoryFilterText.value = "";
    height.value = NaN;
    diameter.value = NaN;
    weight.value = NaN;
    priceWithoutVAT.value = NaN;
    productionCost.value = NaN;
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
            ></InputString>
            <SearchSelect
                class="search-select"
                :options="categories"
                label="Select Category"
                v-model="categoryFilterText"
                @send-option="getSelectedCategory"
            ></SearchSelect>
        </div>
        <div class="sizes-section">
            <span class="section-label">Sizes</span>
            <InputNumber
                label="Height"
                :required="true"
                unit-measure="cm"
                v-model="height"
            ></InputNumber>
            <InputNumber
                label="Diameter"
                :required="true"
                unit-measure="cm"
                v-model="diameter"
            ></InputNumber>
            <InputNumber
                label="Weight"
                :required="true"
                unit-measure="g"
                v-model="weight"
            ></InputNumber>
        </div>
        <div class="prices-section">
            <span class="section-label">Prices</span>
            <InputNumber
                label="Production Cost"
                :required="true"
                unit-measure="RON"
                v-model="productionCost"
            ></InputNumber>
            <InputNumber
                label="Price without V.A.T"
                :required="true"
                unit-measure="RON"
                v-model="priceWithoutVAT"
            ></InputNumber>
        </div>
        <div class="cancel-button-wrapper">
            <SimpleButton
                class="cancel-button"
                label="Cancel"
                @click="router.back()"
            ></SimpleButton>
        </div>
        <div class="add-button-wrapper">
            <SubmitButton
                class="add-button"
                label="Save"
                @submit="saveProduct"
            ></SubmitButton>
        </div>
        <div class="clear-button-wrapper">
            <SimpleButton
                class="clear-button"
                label="Clear All"
                @click="clearFields"
            ></SimpleButton>
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
// .search-select {
//     justify-content: center;
//     align-items: center;
//     position: relative;
// }
.add-button-wrapper {
    /* height: 10%; */
    position: absolute;
    bottom: 5%;
    right: 5%;
}
.add-button {
    background-color: #22c55e;
    color: white;
    &:hover {
        border: 1px solid black;
        color: black;
    }
}
.cancel-button-wrapper {
    position: absolute;
    bottom: 5%;
    right: 15%;
}

.cancel-button {
    background-color: #cbd5e1;
    color: white;
    &:hover {
        border: 1px solid black;
        color: black;
    }
}
.clear-button-wrapper {
    position: absolute;
    bottom: 5%;
    left: 5%;
}
.clear-button {
    background-color: #60a5fa;// rgb(185, 184, 184);
    color: white;
    &:hover {
        border: 1px solid black;
        color: black;
    }
}
</style>