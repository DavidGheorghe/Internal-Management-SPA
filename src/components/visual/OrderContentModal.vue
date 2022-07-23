<script setup lang="ts">
import XButton from '@/components/buttons/XButton.vue';
import { fetchContentByOrderId } from '@/services/OrderService';
import { RetrievedOrderContentDTO } from '@/types/OrderTypes';
import { ref } from 'vue';
import SimpleButton from '../buttons/SimpleButton.vue';

const props = defineProps<{
    isDisplayed: boolean,
    orderId: number
}>();

defineEmits<{
    (e: 'hide-modal'): void,
    (e: 'x-button-click'): void
}>();

const content = ref<RetrievedOrderContentDTO[]>((await fetchContentByOrderId(props.orderId)));
// fetchOrderContent();
// content.value = (await fetchContentByOrderId(props.orderId));
async function fetchOrderContent() {
    content.value = (await fetchContentByOrderId(props.orderId));
}
</script>

<template>
    <div
        v-if="isDisplayed"
        class="backdrop"
    >
        <div class="content">
            <div class="x-button-wrapper">
                <XButton @click="$emit('x-button-click')"/>
            </div>
            <div class="order-content-wrapper">
                <table class="order-content-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Color</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="item in content"
                            :key="item.id"
                        >
                            <td>{{item.product.name}}</td>
                            <td>{{item.color.name}}</td>
                            <td>{{item.quantity}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="close-button-wrapper">
                <SimpleButton 
                    label="Close"
                    @click="$emit('hide-modal')"
                />
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
.backdrop {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 99999;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.35);
}
.content {
    height: 45%;
    width: 60%;
    background-color: #efefef;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}
.x-button-wrapper {
    position: absolute;
    top: 5px;
    right: 5px;
}
.order-content-wrapper {
    height: 50%;
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.order-content-table {
    flex-basis: 100%;
    border-collapse: collapse;
    border: 1px solid black;
}
.close-button-wrapper {
    position: absolute;
    bottom: 5%;
    right: 2%;
    // width: 74px;
    border: 1px solid black;
}
</style>