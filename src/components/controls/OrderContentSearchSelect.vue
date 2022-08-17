<script setup lang="ts">
import { fetchAllProducts } from '@/services/ProductService';
import { fetchAllColors } from '@/services/ColorService';
import { SearchSelectOption } from '@/types/UtilsTypes';
import { computed, ref, watch } from 'vue';
import { OrderContentSearchSelectType } from '@/types/OrderTypes';
import ActionButton from '../buttons/ActionButton.vue';

defineProps<{
    required: boolean
}>();

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
    <div class="container">
        <label>Choose content*</label>
        <div class="order-content-search-select-container">
            <div class="inputs-wrapper">
                <input 
                    class="product-input"
                    type="text"
                    placeholder="Search Product"
                    v-model="productSearchText"
                    :required="required"
                    @focus="displayProductsOptions"
                    @blur="hideOptions"
                >
                <input 
                    class="color-input"
                    type="text"
                    placeholder="Search Color"
                    v-model="colorSearchText"
                    :required="required"
                    @focus="displayColorsOptions"
                    @blur="hideOptions"
                >
                <input
                    class="quantity-input"
                    type="number"
                    placeholder="Amount"
                    v-model="quantity"
                    :required="required"
                    @focus="handleQuantityInput"
                >
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
            </div>
            <ActionButton 
                class="clear-content-button"
                action-type="close"
                @click="clearFields"
            />
            <ActionButton 
                class="add-content-button"
                action-type="add"
                @click="sendContent"
            />
        </div>
    </div>
</template>

<style scoped lang="less">
@import "@/assets/colors.less";

.container {
    display: flex;
    flex-direction: column;
    padding-top: 5px;
}
label {
    all: unset;
    width: 100%;
    text-align: start;
    font-family: 'Segoe UI', serif;
    font-weight: 600;
}
.order-content-search-select-container {
    display: flex;
    position: relative;
    box-sizing: border-box;
    height: 24px;
    margin-top: 5px;
}
input {
    all: unset;
    border: 1px solid grey;
    height: 100%;
    box-sizing: border-box;
    text-overflow: ellipsis;
    padding-left: 0.1rem;
    &:focus {
        border-color: @custom-blue;
    }
}
.inputs-wrapper {
    box-sizing: border-box;
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
#search-select::-webkit-search-cancel-button {
    position: relative;
    margin-right: 20px;
}
.clear-content-button, .add-content-button {
    border: 1px solid grey;
    height: 100%;
}
.clear-content-button, .add-content-button {
    border-radius: 0;
    &:hover {
        box-shadow: none;
    }
}
.clear-content-button {
    background-color: @custom-blue;
}
.add-content-button {
    background-color: @custom-green;
}
</style>