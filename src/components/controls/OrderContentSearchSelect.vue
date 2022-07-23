<script setup lang="ts">
import { fetchAllProducts } from '@/services/ProductService';
import { fetchAllColors } from '@/services/ColorService';
import { SearchSelectOption } from '@/types/UtilsTypes';
import { computed, ref, watch } from 'vue';
import { OrderContentSearchSelectType } from '@/types/OrderTypes';


const emit = defineEmits<{
    (e: 'add-content', content: OrderContentSearchSelectType): void
}>();

defineExpose({
    clearFields
})

enum Options {
    PRODUCTS,
    COLORS,
    NONE
}

const selectedColor = ref<SearchSelectOption>();
const selectedProduct = ref<SearchSelectOption>();
const quantity = ref<number>();

const productsOptions = ref<SearchSelectOption[]>([]);
const colorsOptions = ref<SearchSelectOption[]>([]);

const currentOption = ref(Options.NONE);
const options = ref<SearchSelectOption[]>([]);

const productSearchText = ref("");
const colorSearchText = ref("");
const filteredOptions = computed(() => {
    if (currentOption.value === Options.COLORS) {
        return options.value.filter(option => option.value.includes(colorSearchText.value.trim()));
    } else if (currentOption.value === Options.PRODUCTS) {
        return options.value.filter(option => option.value.includes(productSearchText.value.trim()));
    } else {
        return [];
    }
})

const areOptionsDisplayed = ref(false);
const isCursorOverOptions = ref(false);

(await initProductsOptions());
(await initColorsOptions());

async function initProductsOptions() {
    const products = (await fetchAllProducts());
    for (let i = 0; i < products.length; i++) {
        let option = {} as SearchSelectOption;
        option.id = products[i].id;
        option.value = products[i].name;
        productsOptions.value.push(option);
    }
}

async function initColorsOptions() {
    const colors = (await fetchAllColors())
    for (let i = 0; i < colors.length; i++) {
        let option = {} as SearchSelectOption;
        option.id = colors[i].id;
        option.value = colors[i].name;
        colorsOptions.value.push(option);
    }
}

function displayProductsOptions() {
    currentOption.value = Options.PRODUCTS;
    areOptionsDisplayed.value = true;
}
function displayColorsOptions() {
    currentOption.value = Options.COLORS;
    areOptionsDisplayed.value = true;
}

function hideOptions(event: Event) {
    const mouseEvent = event as MouseEvent;
    if (mouseEvent.relatedTarget === null && isCursorOverOptions.value === false) {
        currentOption.value = Options.NONE;
        areOptionsDisplayed.value = false;
    }
}

function handleQuantityInput() {
    currentOption.value = Options.NONE;
    areOptionsDisplayed.value = false;
}

function selectOption(option: SearchSelectOption) {
    if (currentOption.value === Options.COLORS) {
        colorSearchText.value = option.value;
        selectedColor.value = option;
    } else if (currentOption.value === Options.PRODUCTS) {
        productSearchText.value = option.value;
        selectedProduct.value = option;
    }
    areOptionsDisplayed.value = false;
}

function sendContent() {
    const content = computeContent();
    if (content.color && content.product && content.quantity) {
        emit('add-content', content);
    }
}

function computeContent() {
    const content = {} as OrderContentSearchSelectType;
    if (selectedColor.value) {
        content.color = selectedColor.value;
    }
    if (selectedProduct.value) {
        content.product = selectedProduct.value;
    }
    if (quantity.value) {
        content.quantity = quantity.value;
    }
    return content;
}

function clearFields() {
    productSearchText.value = "";
    colorSearchText.value = "";
    quantity.value = undefined;
}

watch(currentOption, () => {
    if (currentOption.value === Options.COLORS) {
        options.value = colorsOptions.value;
    } else if (currentOption.value === Options.PRODUCTS) {
        options.value = productsOptions.value;
    } else {
        options.value = [];
    }
});
watch(colorSearchText, () => {
    if (colorSearchText.value === "") {
        selectedColor.value = undefined;
    }
});
watch(productSearchText, () => {
    if (productSearchText.value === "") {
        selectedProduct.value = undefined;
    }
})
</script>

<template>
    <div class="order-content-search-select-container">
        <div class="inputs-wrapper">
            <!-- <div class="product-input-wrapper"> -->
                <input 
                    class="product-input"
                    type="text"
                    placeholder="Search Product"
                    v-model="productSearchText"
                    :required="true"
                    @focus="displayProductsOptions"
                    @blur="hideOptions"
                >
            <!-- </div> -->
            <!-- <div class="color-input-wrapper"> -->
                <input 
                    class="color-input"
                    type="text"
                    placeholder="Search Color"
                    v-model="colorSearchText"
                    :required="true"
                    @focus="displayColorsOptions"
                    @blur="hideOptions"
                >
            <!-- </div> -->
            <!-- <div class="quantity-input-wrapper"> -->
                <input
                    class="quantity-input"
                    type="number"
                    placeholder="Amount"
                    v-model="quantity"
                    :required="true"
                    @focus="handleQuantityInput"
                >
            <!-- </div> -->
            <div 
                v-if="areOptionsDisplayed"
                class="options-wrapper"
                @mouseenter="isCursorOverOptions = true"
                @mouseleave="isCursorOverOptions = false"
            >
                <div
                    v-if="filteredOptions.length > 0"
                    id="option"
                    v-for="option in filteredOptions" 
                    :key="option.id.valueOf()"
                    @click="selectOption(option)"
                >
                    {{option.value}}
                </div>
                <div
                    v-else
                    class="empty-options">
                    <span>No Results.</span>
                </div>
            </div>
            <button 
                type="button"
                @click="clearFields"
            >
                Clear
            </button>
            <div class="add-content-button-wrapper">
                <button
                    type="button"
                    @click="sendContent"
                >Add</button>
            </div>
        </div>
        
    </div>
</template>

<style scoped lang="less">
.order-content-search-select-container {
    display: flex;
    position: relative;
}
input {
    all: unset;
    border: 1px solid black;
}
.inputs-wrapper {
    position: relative;
}
.search-select-container {
    padding: 5px 45px 5px 45px;
    height: 50px;
    display: flex;
    flex-direction: column;    
    justify-content: center;
    align-items: center;
    position: relative;
}
#option {
    cursor: pointer;
    padding: 5px;
    &:hover {
        background-color: #efefef;
    }
}
.options-wrapper {
    border: 1px solid #aba6a6;
    border-top: 0;
    position: absolute;
    width: 100%;
    max-height: 10rem;
    box-sizing: border-box;
    left: 0;
    overflow: auto;
    z-index: 99999;
    background-color: white;
}
.empty-options {
    height: 75px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    & span {
        color: grey;
        font-size: 1.8rem;
    }
}
label {
    width: 100%;
    text-align: start;
    font-family: 'Segoe UI', serif;
    font-weight: 600;
}
.input-container {
    height: 50%;
    width: 100%;
    position: relative;
    border: 1px solid #aba6a6;
    margin-top: 5px;
}
.search-bar {
    width: 100%;
    height: 100%;
    &:focus {
        border-color: black;
    }
}
#search-select::-webkit-search-cancel-button {
    position: relative;
    margin-right: 20px;
}
.material-symbols-outlined {
    position: absolute;
    right: 0;
    z-index: -1;
    display: inline;
    cursor: pointer;
    height: 100%;
}
</style>