<script setup lang="ts">
import { pinOrder, unpinOrder, updateOrderStatus } from '@/services/OrderService';
import { Order, DashboardOrder, OrderStatus } from '@/types/OrderTypes';
import { ElNotification } from 'element-plus';
import { ref, watch } from 'vue';
import OrderStatusSelect from '@/components/controls/OrderStatusSelect.vue';

const props = defineProps<{
    order: DashboardOrder
}>();
const emit = defineEmits<{
    (e: 'unpin-order'): void,
    (e: 'update-status', newStatus: OrderStatus): void
}>();

const currentDueDate = ref(props.order.dueDate);
const isContentDisplayed = ref(false);
const currentStatus = ref(props.order.status);
const currentIsOrderPinned = ref(props.order.isPinned);

function togglePinOrder() {
    currentIsOrderPinned.value = !currentIsOrderPinned.value;
    if (currentIsOrderPinned.value) {
        pinOrder(props.order.id);
        orderPinnedNotification();
    } else {
        unpinOrder(props.order.id);
        emit('unpin-order');
        orderUnpinnedNotification();
    }
}

const statusModifiedNotification = () => {
    ElNotification({
        title: 'Status Updated',
        position: 'bottom-right',
        type: 'success',
        offset: 100
    });
}

const orderPinnedNotification = () => {
    ElNotification({
        title: 'Order Pinned',
        position: 'bottom-right',
        type: 'success',
        offset: 100
    });
}

const orderUnpinnedNotification = () => {
    ElNotification({
        title: 'Order Unpinned',
        position: 'bottom-right',
        type: 'success',
        offset: 100
    });
}
watch(currentStatus, async (newStatus) => {
    const statusId = OrderStatus[newStatus];
    await updateOrderStatus(props.order.id, Number.parseInt(statusId));
    emit('update-status', newStatus);
    statusModifiedNotification();
});
</script>

<template>
    <el-card class="order-card-container" :class="{'focused': order.isFocused}" :body-style="{height: '100%'}"> 
        <template #header>
            <div class="card-header">
                <span>
                    <strong>#{{order.id}}</strong>
                </span>
                <span 
                    class="material-symbols-outlined pin-icon" 
                    :class="{'pinned': currentIsOrderPinned}" 
                    @click="togglePinOrder"
                >
                    push_pin
                </span> 
                <span>
                    <strong>{{order.customer.companyName}}</strong>
                </span>
                <span>{{`${order.customer.firstName} ${order.customer.lastName}`}}</span>
            </div>
        </template>
        <div class="body-wrapper">
            <div class="due-date-wrapper">
                <el-date-picker 
                    class="date-picker"
                    v-model="currentDueDate" 
                    format="DD-MM-YYYY"
                    readonly
                />
            </div>
                <OrderStatusSelect 
                    class="status-select"
                    v-model:status="currentStatus"
                />
        </div>
    </el-card>
</template>

<style scoped lang="less">
@import "@/assets/colors.less";


.order-card-container {
    width: 18rem;
    height: 18rem;
    display: flex;
    flex-direction: column;
    border: 2px solid transparent;
}
.focused {
    border: 2px solid  @custom-blue;
}

.card-header {
    display: grid;
    grid-template-columns: auto 24px;
    grid-template-rows: 1fr 1fr 1fr;
}
.body-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    height: 100%;
}
.status-select {
    width: 13.7rem;
}
.pin-icon {
    grid-row-end: span 3;
    align-self: flex-start;
    cursor: pointer;
}
.pinned {
    color: yellow;
}
</style>