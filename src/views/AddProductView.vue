<script setup lang="ts">
import ProductForm from '@/components/forms/ProductForm.vue';
import GoBackButton from '@/components/buttons/GoBackButton.vue';
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();

</script>

<template>
<div class="add-product-view">
    <h3 class="title">Add new product</h3>
    <!-- <button
        class="go-back-btn"
        @click="router.back"
    >Go back
    </button> -->
    <GoBackButton 
        class="btn"
        label="Back"
        @click="router.back()"
    ></GoBackButton>
    <ProductForm class="product-form"></ProductForm>
</div>
</template>

<style scoped>
.add-product-view {
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
    /* position: fixed;
    height: 75%;
    width: 50%;
    left: 25%;
    border-radius: 5px;
    border: 1px solid black;
    display: inline-block;
    margin: 0 auto; */

.product-form {
    position: fixed;
    height: 75%;
    width: 50%;
    left: 25%;
}

.btn {
    position: absolute;
    left: 5%;
}
</style>