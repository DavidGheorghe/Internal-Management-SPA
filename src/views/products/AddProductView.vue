<script setup lang="ts">
import ProductForm from '@/components/forms/ProductForm.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CustomModal from '@/components/visual/CustomModal.vue';
import SimpleButton from '@/components/buttons/SimpleButton.vue';
import XButton from '@/components/buttons/XButton.vue';
const router = useRouter();

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
<div class="add-product-view">
    <h3 class="title">Add new product</h3>
    <ProductForm 
        class="product-form"
        @form-submitted="displayModal"
    />
    <Teleport v-if="isModalDisplayed" to="#modals">
        <CustomModal @keydown.esc="hideModal">
            <!-- <template v-slot:x-button class="modal-x-button">
                <XButton @click="hideModal"/>
            </template> -->
            <template v-slot:title>
                <h2>Product added successfully!</h2>
            </template>
            <template v-slot:text>
                <h4>Would you like to add another product?</h4>
            </template>
            <template v-slot:cancel-button>
                <SimpleButton 
                    class="no-button"
                    label="No"
                    @click="router.back"
                />
            </template>
            <template v-slot:ok-button>
                <SimpleButton 
                    class="yes-button"
                    label="Yes"
                    @click="hideModal"
                />
            </template>
        </CustomModal>
    </Teleport>
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
.product-form {
    position: fixed;
    height: 75%;
    width: 50%;
    left: 25%;
}

.yes-button {
    background-color: green;
}

.no-button {
    background-color: grey;
}
</style>