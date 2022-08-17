<script setup lang="ts">
import { OrderStatus } from '@/types/OrderTypes';
import { ref } from 'vue';
import OrderStatusSelect from './OrderStatusSelect.vue';

const statuses = ref<OrderStatus[]>([]);
const selectedStatus = ref();
</script>

<template>
    <div class="order-status-multi-select-container">
        <!-- <OrderStatusSelect /> -->
    </div>
</template>

<style scoped lang="less">
</style>