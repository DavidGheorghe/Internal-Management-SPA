<script setup lang="ts">
import OrderForm from '@/components/forms/order/OrderForm.vue';
import CustomModal from '@/components/visual/CustomModal.vue';
import SimpleButton from '@/components/buttons/SimpleButton.vue';

import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const isModalDisplayed = ref(false);
const formRef = ref<InstanceType<typeof OrderForm>>();

function displayModal() {
    isModalDisplayed.value = true;
}

function hideModal() {
    formRef.value?.clearFields();
    isModalDisplayed.value = false;
}
</script>

<template>
    <div class="add-order-view">
        <!-- <h3 class="title">Add new order</h3> -->
        <OrderForm 
            ref="formRef"
            class="order-form"
            @form-submitted="displayModal"
        />
        <Teleport to="#modals">
            <CustomModal 
                class="modal"
                :display="isModalDisplayed" 
                @x-button-click="router.back" 
                @hidden-modal="router.back"
            >
                <template v-slot:title>
                    <h1>Order added successfully!</h1>
                </template>
                <template v-slot:text>
                    <h3>Would you like to add another order?</h3>
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
@import "@/assets/colors.less";

.title {
    text-align: center;
    font-family: TimesNewRoman, "Times New Roman", Times;
    font-size: 1.9rem;
}
.add-order-view {
    background-color: #efefef;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.order-form {
    height: 80%;
    width: 75%;
}
.yes-button {
    background-color: @custom-green;
}
.no-button {
    background-color: @custom-blue;
}
.no-button, .yes-button {
    border: 1px solid black;
    border-radius: 0.3rem;
    width: 3.7rem;
    height: 2rem;
    &:hover {
        box-shadow: inset .01rem .01rem 0rem .05rem black;
    }
}
</style>