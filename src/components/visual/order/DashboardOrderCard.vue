<script setup lang="ts">
import OrderStatusSelect from '@/components/controls/OrderStatusSelect.vue';
import PinOrderButton from '@/components/buttons/PinOrderButton.vue';
import { useIsCurrentUserSupervisor } from '@/composables/rolesComposables';
import { assignOrder, pinOrder, unpinOrder, updateDueDate, updateOrderStatus } from '@/services/OrderService';
import { fetchEmployees } from '@/services/UserService';
import { DashboardOrder, OrderStatus } from '@/types/OrderTypes';
import { ElNotification } from 'element-plus';
import { ref, watch } from 'vue';

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
const isOrderPinned = ref(props.order.isPinned);
const isCurrentUserSupervisor = useIsCurrentUserSupervisor();

const currentAssigneeId = ref(props.order.assignee !== null ? props.order.assignee.username : null);
const employees = ref(await fetchEmployees());

function pinOrderClient() {
    pinOrder(props.order.id);
    isOrderPinned.value = true;
    orderPinnedNotification();
}

function unpinOrderClient() {
    unpinOrder(props.order.id);
    isOrderPinned.value = false;
    orderUnpinnedNotification();
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
const dueDateModifiedNotification = () => {
    ElNotification({
        title: 'Due Date Modified',
        position: 'bottom-right',
        type: 'success',
        offset: 100
    });
}

const assigneeUpdatedSuccessNotification = () => {
    ElNotification({
        title: 'Assignee Updated',
        position: 'bottom-right',
        type: 'success',
        offset: 100
    });
}
const assigneeUpdatedFailNotification = () => {
    ElNotification({
        title: 'Could Not Update Assignee',
        position: 'bottom-right',
        type: 'error',
        offset: 100
    });
}
watch(currentStatus, async (newStatus) => {
    const statusId = OrderStatus[newStatus];
    await updateOrderStatus(props.order.id, Number.parseInt(statusId));
    emit('update-status', newStatus);
    statusModifiedNotification();
});

watch(currentDueDate, (newValue, oldValue) => {
    updateDueDate(props.order.id, newValue);
    dueDateModifiedNotification();
});

watch(currentAssigneeId, (newValue) => {
    try {
        if (newValue !== null) {
            assignOrder(props.order.id, newValue);
            assigneeUpdatedSuccessNotification();
        }
    } catch (error) {
        assigneeUpdatedFailNotification();
    }
});

function doNotSendEvent(event: Event) {
    event.stopPropagation();
}
</script>

<template>
    <el-card 
        class="order-card-container" 
        :class="{'focused': order.isFocused}" 
        :body-style="{height: '100%'}"
    >
        <template #header>
            <div class="card-header">
                <span class="id">
                    <strong>#{{order.id}}</strong>
                </span>
                <!-- <span 
                    class="material-symbols-outlined pin-icon" 
                    :class="{'pinned': currentIsOrderPinned}" 
                    @click="togglePinOrder"
                >
                    push_pin
                </span>  -->
                <PinOrderButton 
                    v-if="isCurrentUserSupervisor"
                    class="pin-icon"
                    :is-pinned="isOrderPinned"
                    @pin-order="pinOrderClient"
                    @unpin-order="unpinOrderClient"
                />
                <div class="customer-company-header">
                    <span>
                        <strong>{{order.customer.companyName}}</strong>
                    </span>
                </div>
                <div class="customer-name-header">
                    <span>{{`${order.customer.firstName} ${order.customer.lastName}`}}</span>
                </div>
            </div>
        </template>
        <div class="body-wrapper">
            <el-select
                class="assignee"
                v-model="currentAssigneeId"
                placeholder="Select asignee"
                :disabled="isCurrentUserSupervisor === false"
                @mousedown.stop.prevent
            >
                <el-option
                    v-for="employee in employees"
                    :key="employee.username"
                    :label="employee.username"
                    :value="employee.username"
                />
            </el-select>
            <div 
                class="due-date-wrapper" 
                @mousedown="doNotSendEvent"
            >
                <el-date-picker
                    class="date-picker"
                    v-model="currentDueDate" 
                    format="DD-MM-YYYY"
                    :readonly="isCurrentUserSupervisor === false"
                />
            </div>
                <OrderStatusSelect 
                    @mousedown.stop.prevent
                    class="status-select"
                    v-model:status="currentStatus"
                    :disabled="false"
                />
        </div>
    </el-card>
</template>

<style scoped lang="less">
@import "@/assets/colors.less";


.order-card-container {
    width: 18rem;
    height: 20rem;
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
    grid-row: 1 / 3;
    grid-column: 2 / 3;
    align-self: flex-start;
    cursor: pointer;
}
.id {
    grid-row: 1 / 2;
    grid-column: 1 / 2;
}
.customer-company-header {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
}
.customer-name-header {
    grid-column: 1 / 2;
    grid-row: 3 / 4;
}
</style>