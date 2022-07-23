<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed, ref, watch } from 'vue';
import { updateOrderStatus } from '@/services/OrderService';
import { Order, OrderStatus } from '@/types/OrderTypes';
import SimpleButton from '../buttons/SimpleButton.vue';
import ActionButton from '../buttons/ActionButton.vue';
import OrderContentModal from './OrderContentModal.vue';
import OrderStatusSelect from '../controls/OrderStatusSelect.vue';

const router = useRouter();

const props = defineProps<{
    order: Order
}>();
const emit = defineEmits<{
    (e: 'delete-order'): void;
}>();

const dueDateFormatted = computed(() => props.order.dueDate.toDateString());
const isContentDisplayed = ref(false);
const currentStatus = ref(props.order.status);

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

watch(currentStatus, () => {
    const statusId = OrderStatus[currentStatus.value];
    updateOrderStatus(props.order.id, Number.parseInt(statusId));
});
</script>

<template>
    <div class="order-card-container">
        <div class="props-wrapper">
            <div class="id-wrapper">
                <span>
                    <strong>#{{order.id}}</strong>
                </span>
            </div>
            <div class="customer-details-wrapper">
                <span>
                    <strong>{{order.customer.companyName}}</strong>
                </span>
                <span>{{`${order.customer.firstName} ${order.customer.lastName}`}}</span>
            </div>
            <div class="due-date-wrapper">
                <span>Due Date: </span>
                <span>{{dueDateFormatted}}</span>
            </div>
            <div class="status-wrapper">
                <OrderStatusSelect 
                    v-model:status="currentStatus"
                />
            </div>
        </div>
        <div class="details-wrapper">
            <span>{{order.details}}</span>
        </div>
        <div class="see-content-wrapper">
            <SimpleButton
                class="see-content-button"
                label="See Content"
                @click="displayContentModal"
            />
        </div>
        <div class="delete-order-button-wrapper">
            <ActionButton
                action-type="delete"
                label="Delete"
                @click="deleteOrder"
            />
        </div>
        <div class="edit-button-wrapper">
            <ActionButton
                action-type="edit"
                label="Edit"
                @click="goToEditPage"
            />
        </div>
    </div>
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
    background-color: white;
    height: 100%;
    width: 100%;
    border: 1px solid black;
    border-radius: 5px;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    > * {
        flex-basis: 100%;
    }
}
.customer-details-wrapper {
    display: flex;
    flex-direction: column;
}

.see-content-button {
    width: 100px;
    border: 1px solid black;
}
</style>