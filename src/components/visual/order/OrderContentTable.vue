<script setup lang="ts">
import { fetchContentByOrderId } from '@/services/OrderService';
import { RetrievedOrderContentDTO } from '@/types/OrderTypes.js';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
    orderId: number
}>();
const currentOrderId = computed(() => props.orderId);
const content = ref<RetrievedOrderContentDTO[]>((await fetchContentByOrderId(currentOrderId.value)));

watch(currentOrderId, async () => {
    content.value = (await fetchContentByOrderId(currentOrderId.value));
})
</script>

<template>
    <table class="order-content-table">
        <thead>
            <tr>
                <th>#</th>
                <th>Product</th>
                <th>Color</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in content" :key="item.id">
                <td class="index-column">{{index + 1}}</td>
                <td class="product-name-column">{{ item.product.name }}</td>
                <td>{{ item.color.name }}</td>
                <td class="numerical-cell">{{ item.quantity }}</td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped lang="less">
.order-content-table {
    width: 30rem;
}
.numerical-cell {
    text-align: right;
}
.index-column {
    text-align: right;
}
.product-name-column {
    padding-left: 0.5rem;
}
</style>