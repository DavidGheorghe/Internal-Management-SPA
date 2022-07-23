<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useProductsStore } from '@/stores/ProductsStore';
import { computed, ref } from 'vue';
import { APIUrls } from '@/utils/APIURLs';
import ProductForm from '@/components/forms/ProductForm.vue';
import CustomModal from '@/components/visual/CustomModal.vue';
import SimpleButton from '@/components/buttons/SimpleButton.vue';
import XButton from '@/components/buttons/XButton.vue';

const route = useRoute();
const router = useRouter();
const productsStore = useProductsStore();
const updatedProductId = route.params.id;

const getProductByIdURL = computed(() => APIUrls.API_PRODUCTS_ROOT + "/" + updatedProductId); 
const updatedProduct = (await productsStore.fetchProductById(getProductByIdURL.value));

const isModalDisplayed = ref(false);

function toggleModal() {
    isModalDisplayed.value = !isModalDisplayed.value;
}

function displayModal() {
    isModalDisplayed.value = true;
}

function hideModal() {
    isModalDisplayed.value = false;
}
</script>

<template>
<div class="update-product-view">
    <h3 class="title">Edit Product <div class="product-name">{{updatedProduct.name}}</div></h3>
    <ProductForm
        class="product-form"
        :updated-product="updatedProduct"
        @form-submitted="displayModal"
    />
    <Teleport to="#modals">
        <CustomModal
            :display="isModalDisplayed"
            @x-button-click="router.back"
            @keyup.esc="router.back">
            <template v-slot:title>
                <h2>Product edited successfully!</h2>
            </template>
            <template v-slot:ok-button>
                <SimpleButton 
                    class="ok-button"
                    label="Ok"
                    @click="router.back"
                />
            </template>
        </CustomModal>
    </Teleport>
</div>
</template>

<style lang="less" scoped>
.update-product-view {
    height: calc(100% - 7vh);
    margin-top: 7vh;
    overflow: hidden;
    background-color:#efefef;
}

.title {
    text-align: center;
    font-family: TimesNewRoman, "Times New Roman", Times;
    font-size: 1.9rem;
}

.product-name {
    display: inline;
    color: #60a5fa;
}

.product-form {
    position: fixed;
    height: 75%;
    width: 50%;
    left: 25%;
    // bottom: 7%;
}

.ok-button {
    background-color: #22c55e;
    color: white;
    &:hover {
        border: 1px solid black;
        color: black;
    }
}
</style>