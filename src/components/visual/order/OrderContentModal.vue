<script setup lang="ts">
import { fetchContentByOrderId } from '@/services/OrderService';
import { RetrievedOrderContentDTO } from '@/types/OrderTypes';
import { ref } from 'vue';
import XButton from '@/components/buttons/XButton.vue';
import SimpleButton from '@/components/buttons/SimpleButton.vue';
import OrderContentTable from './OrderContentTable.vue';

const props = defineProps<{
    isDisplayed: boolean,
    orderId: number
}>();

defineEmits<{
    (e: 'hide-modal'): void,
    (e: 'x-button-click'): void
}>();

// const content = ref<RetrievedOrderContentDTO[]>((await fetchContentByOrderId(props.orderId)));
// fetchOrderContent();
// content.value = (await fetchContentByOrderId(props.orderId));
// async function fetchOrderContent() {
//     content.value = (await fetchContentByOrderId(props.orderId));
// }
</script>

<template>
    <Transition>
        <div
            v-if="isDisplayed"
            class="backdrop"
        >
            <div class="content">
                <div class="x-button-wrapper">
                    <XButton @click="$emit('x-button-click')"/>
                </div>
                <h3>Order #{{orderId}}</h3>
                <div class="order-content-wrapper">
                    <OrderContentTable :order-id="orderId"/>
                </div>
                <div class="close-button-wrapper">
                    <SimpleButton 
                        class="close-button"
                        label="Close"
                        @click="$emit('hide-modal')"
                    />
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped lang="less">
@import "@/assets/colors.less";

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
    width: 40%;
    background-color: #efefef;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    padding-top: 2rem;
    box-sizing: border-box;
}
.x-button-wrapper {
    position: absolute;
    top: 5px;
    right: 5px;
}
.order-content-wrapper {
    width: 30rem;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: flex-start;
}
.order-content-table {
    // flex-basis: 100%;
    // border-collapse: collapse;
    // border: 1px solid black;
    font-size: 1rem;
    border: 1px solid grey;
    border-radius: 0.2rem;
}
.close-button-wrapper {
    position: absolute;
    bottom: 6%;
    right: 5%;
}
.close-button {
    width: 5rem;
    height: 2rem;
    background-color: @custom-blue;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>