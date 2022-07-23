<script setup lang="ts">
import OrderForm from '@/components/forms/OrderForm.vue';
import CustomModal from '@/components/visual/CustomModal.vue';
import SimpleButton from '@/components/buttons/SimpleButton.vue';

import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const isModalDisplayed = ref(false);

function displayModal() {
    isModalDisplayed.value = true;
}

function hideModal() {
    isModalDisplayed.value = false;
}
</script>

<template>
    <div class="add-order-view">
        <h3 class="title">Add new order</h3>
        <OrderForm 
            class="order-form"
            @form-submitted="displayModal"
        />
        <Teleport to="#modals">
            <CustomModal :display="isModalDisplayed" @x-button-click="router.back" @hidden-modal="router.back">
                <template v-slot:title>
                    <h2>Order added successfully!</h2>
                </template>
                <template v-slot:text>
                    <h4>Would you like to add another order?</h4>
                </template>
                <template v-slot:cancel-button>
                    <SimpleButton class="no-button" label="No" @click="router.back" />
                </template>
                <template v-slot:ok-button>
                    <SimpleButton class="yes-button" label="Yes" @click="hideModal" />
                </template>
            </CustomModal>
        </Teleport>
    </div>
</template>

<style scoped lang="less">
.title {
    text-align: center;
    font-family: TimesNewRoman, "Times New Roman", Times;
    font-size: 1.9rem;
}

.add-order-view {
    background-color: #efefef;
    overflow: hidden;
}

.order-form {
    position: fixed;
    height: 80%;
    width: 70%;
    left: 20%;
}
</style>