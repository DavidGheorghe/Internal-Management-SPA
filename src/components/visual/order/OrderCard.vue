<script setup lang="ts">
import ActionButton from '@/components/buttons/ActionButton.vue';
import PinOrderButton from '@/components/buttons/PinOrderButton.vue';
import SimpleButton from '@/components/buttons/SimpleButton.vue';
import OrderStatusSelect from '@/components/controls/OrderStatusSelect.vue';
import OrderContentModal from '@/components/visual/order/OrderContentModal.vue';
import { useIsCurrentUserSupervisor } from '@/composables/rolesComposables';
import { assignOrder, pinOrder, unpinOrder, updateDueDate, updateOrderStatus } from '@/services/OrderService';
import { fetchEmployees } from '@/services/UserService';
import { useUserStore } from '@/stores/UserStore';
import { Order, OrderStatus } from '@/types/OrderTypes';
import { ElNotification } from 'element-plus';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();

const props = defineProps<{
    order: Order
}>();
const emit = defineEmits<{
    (e: 'delete-order'): void;
}>();

const currentDueDate = ref(props.order.dueDate);
const isContentDisplayed = ref(false);
const currentStatus = ref(props.order.status);
const isOrderPinned = ref(props.order.isPinned);

const isCurrentUserSupervisor = useIsCurrentUserSupervisor();

const isStatusSelectDisabled = computed(() => {
    let isDisabled: boolean = false;
    if (isCurrentUserSupervisor === false) {
        if (props.order.assignee?.username !== userStore.getCurrentUsername) {
            isDisabled = true;
        }
    }
    return isDisabled;
});

const currentAssigneeId = ref(props.order.assignee !== null ? props.order.assignee.username : null);
const employees = ref(await fetchEmployees());

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
</script>

<template>
    <el-card class="order-card-container" :body-style="{height: '100%'}"> 
        <template #header>
            <div class="card-header">
                <span>
                    <strong>#{{order.id}}</strong>
                </span>
                <PinOrderButton 
                    class="pin-icon"
                    :is-pinned="isOrderPinned"
                    :is-disabled="isCurrentUserSupervisor === false"
                    @pin-order="pinOrderClient"
                    @unpin-order="unpinOrderClient"
                />
                <span>
                    <strong>{{order.customer.companyName}}</strong>
                </span>
                <span>{{`${order.customer.firstName} ${order.customer.lastName}`}}</span>
            </div>
        </template>
        <div class="body-wrapper">
            <div class="assignee-due-status-wrapper">
                <span class="assignee-label">Asignee:</span>
                <span class="due-label">Due:</span>
                <span class="status-label">Status:</span>

                <el-select
                    class="assignee"
                    v-model="currentAssigneeId"
                    placeholder="Select asignee"
                    :disabled="isCurrentUserSupervisor === false"
                >
                    <el-option
                        v-for="employee in employees"
                        :key="employee.username"
                        :label="employee.username"
                        :value="employee.username"
                    />
                </el-select>
                <div class="due">
                    <el-date-picker
                        v-model="currentDueDate" 
                        format="DD-MM-YYYY"
                        :disabled-date="isDateInThePast"
                        :disabled="isCurrentUserSupervisor === false"
                    />
                </div>
                <OrderStatusSelect 
                    class="status"
                    v-model:status="currentStatus"
                    :disabled="isStatusSelectDisabled"
                />
            </div>
            <div class="details-wrapper" :class="{'no-details': order.details.length === 0}">
                <span 
                    v-if="order.details.length === 0"
                    class="no-details"
                >
                    No details.
                </span>
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
                    :disabled="isCurrentUserSupervisor === false"
                    @click="deleteOrder"
                />
                <ActionButton
                    class="edit-button"
                    action-type="edit"
                    label="Edit"
                    :disabled="isCurrentUserSupervisor === false"
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
    grid-template-rows: repeat(3, min-content);
}
.pin-icon {
    grid-row-end: span 3;
    align-self: flex-start;
    cursor: pointer;
}
.body-wrapper {
    height: 100%;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 1fr 1fr 0.5fr;
}
.assignee-due-status-wrapper {
    grid-row: 1 / 2;
    grid-column: 1 / 4;
    display: grid;
    grid-template-columns: 25% 75%;
    grid-template-rows: 1fr 1fr 1fr;
    align-items: center;
    justify-items: start;
    .assignee {
        grid-row: 1 / 2;
        grid-column: 2 / 3;
        
    }
    .assignee-label {
        color: grey;
        grid-row: 1 / 2;
        grid-column: 1 / 2;
    }
    .due-label {
        color: grey;
        grid-row: 2 / 3;
        grid-column: 1 / 2;
    }
    .due {
        grid-row: 2 / 3;
        grid-column: 2 / 3;
        width: 100%;
    }
    .status-label {
        color: grey;
        grid-row: 3 / 4;
        grid-column: 1 / 2;
    }
    .status {
        grid-row: 3 / 4;
        grid-column: 2 / 3;
    }

}
.details-wrapper {
    grid-row: 2 / 3;
    grid-column: 1 / 4;
    padding: 1%;
    margin: 1rem;
    margin-left: 0;
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
        white-space: nowrap; 
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
.actions-wrapper {
    grid-row: 3 / 4;
    grid-column: 1 / 4;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    > * {
        place-self: center;
        width: 75%;
        height: 2rem;
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