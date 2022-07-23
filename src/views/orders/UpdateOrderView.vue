<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchOrderById } from '@/services/OrderService';
import OrderForm from '@/components/forms/OrderForm.vue';
import CustomModal from '@/components/visual/CustomModal.vue';
import SimpleButton from '@/components/buttons/SimpleButton.vue';


const router = useRouter();

const props = defineProps<{
    id: string
}>();

const order = ref((await fetchOrderById(Number.parseInt(props.id))));

const isModalDisplayed = ref(false);

function displayModal() {
    isModalDisplayed.value = true;
}

function hideModal() {
    isModalDisplayed.value = false;
}
</script>

<template>
    <div class="update-order-view">
        <h3>Edit order <div class="order-id">#{{id}}</div></h3>
        <OrderForm 
            :edited-order="order"
            @form-submitted="displayModal"
        />
        <Teleport to="#modals">
            <CustomModal
                :display="isModalDisplayed"
                @x-button-click="router.back"
                @hidden-modal="router.back">
                <template v-slot:title>
                    <h2>Order edited successfully!</h2>
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

<style scoped lang="less">

</style>