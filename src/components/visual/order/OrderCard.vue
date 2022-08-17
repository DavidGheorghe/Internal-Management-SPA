<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed, ref, watch } from 'vue';
import { pinOrder, unpinOrder, updateDueDate, updateOrderStatus } from '@/services/OrderService';
import { Order, OrderStatus } from '@/types/OrderTypes';
import { useNotification } from '@/composables/useNotification';
import SimpleButton from '@/components/buttons/SimpleButton.vue';
import ActionButton from '@/components/buttons/ActionButton.vue';
import OrderContentModal from '@/components/visual/order/OrderContentModal.vue';
import OrderStatusSelect from '@/components/controls/OrderStatusSelect.vue';
import CustomNotification from './CustomNotification.vue';
import { ElNotification } from 'element-plus';

const router = useRouter();

const props = defineProps<{
    order: Order
}>();
const emit = defineEmits<{
    (e: 'delete-order'): void;
}>();

const currentDueDate = ref(props.order.dueDate);
const isContentDisplayed = ref(false);
const currentStatus = ref(props.order.status);
const currentIsOrderPinned = ref(props.order.isPinned);

function displayContentModal() {
    isContentDisplayed.value = true;
}
function hideContentModal() {
    isContentDisplayed.value = false;
}
function deleteOrder() {
    emit('delete-order');
}

function goToEditPage() {
    const url = "/orders/update-order/" + props.order.id;
    router.push(url);
}

function togglePinOrder() {
    currentIsOrderPinned.value = !currentIsOrderPinned.value;
    if (currentIsOrderPinned.value) {
        pinOrder(props.order.id);
        orderPinnedNotification();
    } else {
        unpinOrder(props.order.id);
        orderUnpinnedNotification();
    }
}

const dueDateModifiedNotification = () => {
    ElNotification({
        title: 'Due Date Modified',
        position: 'bottom-right',
        type: 'success',
        offset: 100
    });
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

function isDateInThePast(date: Date) {
    return date < new Date();
}

watch(currentStatus, (newValue) => {
    const statusId = OrderStatus[newValue];
    updateOrderStatus(props.order.id, Number.parseInt(statusId));
    statusModifiedNotification();
});

watch(currentDueDate, (newValue, oldValue) => {
    updateDueDate(props.order.id, newValue);
    dueDateModifiedNotification();
})
</script>

<template>
<!-- :body-style="{height: '100%'}" -->
        <el-card class="order-card-container" :body-style="{height: '100%'}"> 
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
                <div class="status-select-wrapper">
                    <OrderStatusSelect 
                        v-model:status="currentStatus"
                    />
                </div>
                <div class="due-date-wrapper">
                    <!-- <span>Due Date</span> -->
                    <el-date-picker 
                        v-model="currentDueDate" 
                        format="DD-MM-YYYY"
                        :disabled-date="isDateInThePast"
                    />
                </div>
                <div class="details-wrapper" :class="{'no-details': order.details.length === 0}">
                    <span 
                        v-if="order.details.length === 0"
                        class="no-details"
                    >No details.</span>
                    <span 
                        v-else
                        class="details"
                    >{{order.details}}</span>
                </div>
                <div class="actions-wrapper">
                    <SimpleButton
                        class="see-content-button"
                        label="See Content"
                        @click="displayContentModal"
                    />
                    <ActionButton
                        class="delete-button"
                        action-type="delete"
                        label="Delete"
                        @click="deleteOrder"
                    />
                    <ActionButton
                        class="edit-button"
                        action-type="edit"
                        label="Edit"
                        @click="goToEditPage"
                    />
                </div>
            </div>
    </el-card>
    <Teleport to="#modals">
        <OrderContentModal
            :is-displayed="isContentDisplayed"
            :order-id="order.id"
            @x-button-click="hideContentModal"
            @hide-modal="hideContentModal"
        />
    </Teleport>
</template>

<style scoped lang="less">
.order-card-container {
    width: 25rem;
    height: 25rem;
    display: flex;
    flex-direction: column;
    margin: 2rem;
}
.card-header {
    display: grid;
    grid-template-columns: auto 24px;
    grid-template-rows: 1fr 1fr 1fr;
}
.pin-icon {
    grid-row-end: span 3;
    align-self: flex-start;
    cursor: pointer;
}
.pinned {
    color: yellow;
}
.body-wrapper {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
}
.due-date-wrapper {
    grid-column-start: span 2;
    grid-row-start: 1;
    align-self: center;
    justify-self: start;
}
.status-select-wrapper {
    // place-self: center end;
    justify-self: center;
    align-self: center;
}
.details-wrapper {
    grid-row-start: 2;
    grid-column-start: span 3;
    padding: 1%;
    border-radius: 0.2rem;
    border: solid 1px black;
    & .no-details {
        color: grey;
    }
    &.no-details {
        border-color: grey;
    }
    & .details {
        color: black;
    }
}
.actions-wrapper {
    grid-row-start: 3;
    grid-column-start: span 3;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    > * {
        place-self: center;
        width: 75%;
        height: 2rem; //20%;
    }
    .see-content-button {
        background-color: #06b6d4;
        align-self: end;
        justify-self: start;
        font-size: 0.9rem;
    }
    .delete-button {
        background-color: #dc2626;
        align-self: end;
        justify-self: center;
    }
    .edit-button {
        align-self: end;
        justify-self: end;
        background-color: #fde047;
    }
}
</style>