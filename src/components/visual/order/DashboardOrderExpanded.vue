<script setup lang="ts">
import { Order, RetrievedOrderContentDTO } from '@/types/OrderTypes';
import OrderProgress from './OrderProgress.vue';
import XButton from '@/components/buttons/XButton.vue';
import { fetchContentByOrderId } from '@/services/OrderService';
import { ref, computed } from 'vue';
import OrderContentTable from './OrderContentTable.vue';
import { useExpandedOrderStore } from '@/stores/ExpandedOrderStore';

const expandedOrderStore = useExpandedOrderStore();

defineEmits<{
    (e: 'hide-order'): void
}>();

const order = computed(() => expandedOrderStore.getDisplayedOrder)
const currentOrderId = computed(() => expandedOrderStore.getDisplayedOrderId);
</script>

<template>
    <div class="container">
        <h2 class="id">#{{order!.id}}</h2>
        <XButton 
            class="close-button"
            @click="$emit('hide-order')"    
        />
        <OrderProgress class="progress-bar" :order="order!"/>
        <div class="details-and-content-wrapper">
            <div class="content-wrapper">
                <h4 class="content-wrapper-label">Content</h4>
                <OrderContentTable 
                    class="content-table"
                    :order-id="currentOrderId!"
                />
            </div>
            <div class="details-wrapper">
                <h4 class="details-wrapper-label" :class="{'no-details': order!.details !== ''}">Details</h4>
                <p 
                    v-if="order!.details"
                    class="details-wrapper-value"
                >
                    {{order!.details}}
                </p>
                <p
                    v-else
                    class="details-wrapper-empty-value"
                >
                    No details.
                </p>
            </div>
        </div>    
    </div>
</template>

<style scoped lang="less">
.container {
    height: 31rem;
    position: relative;
    box-sizing: border-box;
    margin-top: 1rem;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 5rem 6rem auto;
}
.id {
    grid-row: 1 / 2;  
}
.close-button {
    position: absolute;
    right: 1rem;
    top: -0.5rem;
}
.progress-bar {
    grid-row: 2 / 3;
}
.details-and-content-wrapper {
    grid-row: 3 / 5;
    display: grid;
    grid-template-columns: 1.5fr 1.5fr;
    grid-template-rows: max-content;
}
.details-wrapper {
    &-label {
        color: black;
        font-size: 1.2rem;
        & .no-details {
            color: grey;
        }
    }
    &-value {
        border: 1px solid black;
        padding: 1rem;
        border-radius: 1rem;
    }
    &-empty-value {
        border: 1px solid grey;
        padding: 1rem;
        border-radius: 1rem;
        color: grey;
    }
    
}
.content-wrapper {
    &-label {
        display: block;
        color: black;
        font-size: 1.2rem;
    }
}
.content-table {
    font-size: 1rem;
}
</style>
