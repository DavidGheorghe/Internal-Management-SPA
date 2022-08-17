<script setup lang="ts">
import { OrderContentSearchSelectType } from '@/types/OrderTypes';
import ActionButton from '@/components/buttons/ActionButton.vue';
import { computeContentPrice } from '@/services/OrderService';
import { computed } from 'vue';

const props = defineProps<{
    item: OrderContentSearchSelectType
}>();

defineEmits<{
    (e: 'delete-content', itemToDelete: OrderContentSearchSelectType): void
}>();

const price = await computeContentPrice(props.item.product.id, props.item.quantity);

defineExpose({
    price
});
</script>

<template>
    <div class="order-content-card-container">
        <div class="product-wrapper">
            <span class="label">Product: </span>
            <span>{{item.product.value}}</span>
        </div>
        <div class="color-wrapper">
            <span class="label">Color: </span>
            <span>{{item.color.value}}</span>
        </div>
        <div class="quantity-wrapper">
            <span class="label">Amount: </span>
            <span>{{item.quantity}}</span>
        </div>
        <div class="price-wrapper">
            <span class="label">Price: </span>
            <span>{{price}}RON</span>
        </div>
        <ActionButton 
            class="delete-button"
            action-type="delete"
            @click="$emit('delete-content', item)"
        />
    </div>
</template>

<style scoped lang="less">
@import "@/assets/colors.less";

.order-content-card-container {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: relative;
    border: 1px solid @custom-green;
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    grid-template-columns: auto 5rem;
    padding: 0.3rem;
    border-radius: 0.2rem;
}
.product-wrapper {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
}
.color-wrapper {
    grid-column: 1 / 2;
    grid-row: 2 / 3;    
}
.quantity-wrapper {
    grid-column: 1 / 2;
    grid-row: 3 / 4;
}
.delete-button {
    grid-column: 2 / 3;
    grid-row: 1 / 5;
    color: #b91c1c;
    background-color: inherit;
    height: 50%;
    width: 50%;
    align-self: center;
    justify-self: end;
    &:hover {
        border: none;
        color: #b91c1c;
    }
}
.label {
    color: grey;
}
</style>