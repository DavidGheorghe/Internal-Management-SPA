<script setup lang="ts">
import { OrderContentSearchSelectType } from '@/types/OrderTypes';
import ActionButton from '../buttons/ActionButton.vue';

defineProps<{
    item: OrderContentSearchSelectType
}>();

defineEmits<{
    (e: 'delete-content', itemToDelete: OrderContentSearchSelectType): void
}>();
</script>

<template>
    <div class="order-content-card-container">
        <div class="product-wrapper">
            <span>{{item.product.value}}</span>
        </div>
        <div class="color-wrapper">
            <span>{{item.color.value}}</span>
        </div>
        <div class="quantity-wrapper">
            <span>{{item.quantity}}</span>
        </div>
        <div class="delete-button-wrapper">
            <ActionButton 
                label="Delete"
                action-type="delete"
                @click="$emit('delete-content', item)"
            />
        </div>
    </div>
</template>

<style scoped lang="less">
.order-content-card-container {
    width: 100%;
    height: 100%;
    position: relative;
    border: 1px solid black;
}
.delete-button-wrapper {
    position: absolute;
    right: 1rem;
    bottom: 0.5rem;
}
</style>