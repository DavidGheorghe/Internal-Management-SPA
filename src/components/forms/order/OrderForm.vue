<script setup lang="ts">
import { computed, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Customer } from '@/types/CustomerTypes';
import { fetchCustomerById, fetchAllCustomers } from '@/services/CustomerSerivce';
import { SearchSelectOption } from '@/types/UtilsTypes';
import SearchSelect from '../../controls/SearchSelect.vue';
import OrderContentSearchSelect from '../../controls/OrderContentSearchSelect.vue';
import InputTextarea from '../../controls/InputTextarea.vue';
import SubmitButton from '../../buttons/SubmitButton.vue';
import SimpleButton from '../../buttons/SimpleButton.vue';
import OrderContentSection from '@/components/forms/order/OrderContentSection.vue';
import { AddOrderContentDTO, OrderDTO, Order, OrderContentSearchSelectType, RetrievedOrderContentDTO } from '@/types/OrderTypes';
import OrderContentCard from '@/components/visual/order/OrderContentCard.vue';
import { addOrder, fetchContentByOrderId, updateOrder } from '@/services/OrderService';
import OrderCustomerSection from './OrderCustomerSection.vue';
import OrderDetailsSection from './OrderDetailsSection.vue';

const props = defineProps<{
    editedOrder?: Order
}>();

const emit = defineEmits<{
    (e: 'form-submitted'): void
}>();

const router = useRouter();

const contentSectionRef = ref<InstanceType<typeof OrderContentSection>>();
const customerSectionRef = ref<InstanceType<typeof OrderCustomerSection>>();
const detailsSectionRef = ref<InstanceType<typeof OrderDetailsSection>>();

const customer = ref<Customer | null>(props.editedOrder?.customer || null);

const details = ref<string>(props.editedOrder?.details || "");
const dueDate = ref<Date | null>(props.editedOrder?.dueDate || null);
const content = ref<AddOrderContentDTO[]>([]);

const isSaveButtonDisabled = computed(() => {
    let shouldBeDisabled = true;
    if (customer.value !== null && content.value.length > 0) {
        shouldBeDisabled = false;
    }
    if (!props.editedOrder && dueDate.value === null) {
        shouldBeDisabled = true;
    }
    return shouldBeDisabled;
});

async function saveOrder() {
    const order = {} as OrderDTO;
    order.customerId = customer.value!.id;
    order.details = details.value;
    if (!props.editedOrder) {
        order.dueDate = dueDate.value!.toISOString().substring(0, 10);
    }
    order.content = content.value;
    if (props.editedOrder) {
        await updateOrder(props.editedOrder.id, order);
    } else {
        await addOrder(order);
    }
    emit('form-submitted');
}

function clearFields() {
    contentSectionRef.value?.clearSearchFilter();
    contentSectionRef.value?.clearContent();
    customerSectionRef.value?.clearSearchFilter();
    detailsSectionRef.value?.clearDueDateAndDetails();

    customer.value = null;
    // dueDate.value = null;
    details.value = "";
    content.value = [];
}

function updateCustomer(newCustomer: Customer | null) {
    customer.value = newCustomer;
}
function updateContent(newContent: AddOrderContentDTO[]) {
    content.value = newContent;
}
function updateDetails(newDetails: string) {
    details.value = newDetails;
}
function updateDueDate(newDueDate: Date | null) {
    dueDate.value = newDueDate;
}

defineExpose({
    clearFields
});
</script>

<template>
    <div class="order-form-container">
        <form @submit.prevent>
            <section class="customer-section">
                <OrderCustomerSection 
                    @update-customer="updateCustomer"
                    ref="customerSectionRef"
                    :edited-order="editedOrder"
                />
            </section>
            <section class="content-section">
                <OrderContentSection
                    @update-content="updateContent"
                    ref="contentSectionRef"
                    :edited-order="editedOrder"/>
            </section>
            <section class="details-section">
                <OrderDetailsSection
                    @update-details="updateDetails"
                    @update-due-date="updateDueDate"
                    ref="detailsSectionRef"
                    :edited-order="editedOrder"
                />
            </section>
            <div class="clear-button-wrapper">
                <SimpleButton
                    class="clear-button"
                    label="Clear All"
                    @click="clearFields"
                />
            </div>
            <div class="cancel-and-save-buttons-wrapper">
                <div class="cancel-button-wrapper">
                    <SimpleButton
                        class="cancel-button"
                        label="Cancel"
                        @click="router.back()"
                    />
                </div>
                <div class="add-button-wrapper">
                    <SubmitButton
                        class="add-button"
                        label="Save"
                        :is-disabled="isSaveButtonDisabled"
                        @submit="saveOrder"
                    />
                </div>
            </div>
            
        </form>
    </div>
</template>

<style scoped lang="less">
@import "@/assets/colors.less";

.order-form-container {
    background-color: white;
    position: relative;
    box-shadow: .01rem .01rem .3rem black;
    padding: 1rem;
    border-radius: 5px;
}
form {
    display: grid;
    grid-template-columns: 30% 50% 20%;
    grid-template-rows: 90% 10%;
    grid-auto-flow: column;
    grid-auto-rows: 1fr;
    height: 100%;
    width: 100%;
}
.customer-section {
    grid-row: 1 / 2;
}
.content-section{
    justify-self: center;
    grid-row: 1 / 2;
}
.details-section {
    justify-self: center;
    grid-row: 1 / 2;
}
.cancel-and-save-buttons-wrapper {
    grid-row: 2 / 3;
    grid-column: 3 / 4;
    display: grid;
    grid-template-columns: 50% 50%;
}
.add-button-wrapper {
    justify-self: center;
    align-self: center;
}

.cancel-button-wrapper {
    justify-self: center;
    align-self: center;
}
.cancel-button {
    background-color: #d1d5db;
}
.clear-button-wrapper {
    grid-row: 2 / 3;
    grid-column: 1 / 2;
    align-self: center;
    padding-left: 2.5rem;
}
.clear-button, .cancel-button, .add-button {
    width: 6rem;
    height: 1.75rem;
    font-size: 1.05rem;
    font-weight: 500;
    border: 1px solid black;
    border-radius: 0.3rem;
    &:hover {
        box-shadow: inset .01rem .01rem 0rem .05rem black;
    }
}
.clear-button {
    background-color: @custom-blue;
}
.add-button {
    background-color: @custom-green;
    &:disabled {
        border-color: transparent;
        box-shadow: none;
        color: white;
        opacity: 0.5;
    }
}
</style>