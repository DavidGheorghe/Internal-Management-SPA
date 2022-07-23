<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Customer } from '@/types/CustomerTypes';
import { fetchCustomerById, fetchAllCustomers } from '@/services/CustomerSerivce';
import { SearchSelectOption } from '@/types/UtilsTypes';
import SearchSelect from '../controls/SearchSelect.vue';
import OrderContentSearchSelect from '../controls/OrderContentSearchSelect.vue';
import InputTextarea from '../controls/InputTextarea.vue';
import SubmitButton from '../buttons/SubmitButton.vue';
import SimpleButton from '../buttons/SimpleButton.vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { AddOrderContentDTO, OrderDTO, Order, OrderContentSearchSelectType, RetrievedOrderContentDTO } from '@/types/OrderTypes';
import OrderContentCard from '../visual/OrderContentCard.vue';
import { addOrder, fetchContentByOrderId, updateOrder } from '@/services/OrderService';

const props = defineProps<{
    editedOrder?: Order
}>();

const emit = defineEmits<{
    (e: 'form-submitted'): void
}>();

const router = useRouter();

const contentSearchSelect = ref<InstanceType<typeof OrderContentSearchSelect> | null>(null);

const customersOptions = ref<SearchSelectOption[]>([]);
const customer = ref<Customer | null>(props.editedOrder?.customer || null);
const customerFilterText = ref<string>("");

const details = ref<string>(props.editedOrder?.details || "");
const dueDate = ref<Date | null>(props.editedOrder?.dueDate || null);
const content = ref<AddOrderContentDTO[]>([]);
const contentToDisplay = ref<OrderContentSearchSelectType[]>([]);

const isSaveButtonDisabled = computed(() => customer.value === undefined ||  dueDate.value === undefined);

(await initCustomersOptions());

if (props.editedOrder) {
    initCustomerFilterText(props.editedOrder);
    initContent(props.editedOrder);
}

function initCustomerFilterText(order: Order) {
    const companyName = order.customer.companyName;
    const firstName = order.customer.firstName;
    const lastName = order.customer.lastName;
    const customerSearchSelectValue = computeSearchSelectValueForCustomer(lastName, firstName, companyName);
    customerFilterText.value = customerSearchSelectValue;
}

async function initContent(order: Order) {
    const fetchedContent = (await fetchContentByOrderId(order.id));
    initContentToAdd(fetchedContent);
    initContentToDisplay(fetchedContent);
}

function initContentToDisplay(fetchedContent: RetrievedOrderContentDTO[]) {
    let initialContentToDisplay: OrderContentSearchSelectType[] = [];
    fetchedContent.forEach((fetchedItem) => {
        const item = {} as OrderContentSearchSelectType;
        item.color = computeColorSearchSelectOption(fetchedItem);
        item.product = computeProductSearchSelectOption(fetchedItem);
        item.quantity = fetchedItem.quantity;
        initialContentToDisplay.push(item);
    });
    contentToDisplay.value = initialContentToDisplay;
}

function computeColorSearchSelectOption(item: RetrievedOrderContentDTO): SearchSelectOption {
    const searchSelectOption = {} as SearchSelectOption;
    searchSelectOption.id = item.id;
    searchSelectOption.value = item.color.name;

    return searchSelectOption;
}
function computeProductSearchSelectOption(item: RetrievedOrderContentDTO): SearchSelectOption {
    const searchSelectOption = {} as SearchSelectOption;
    searchSelectOption.id = item.id;
    searchSelectOption.value = item.product.name;

    return searchSelectOption;
}

function initContentToAdd(fetchedContent: RetrievedOrderContentDTO[]) {
    let initialContentToAdd: AddOrderContentDTO[] = [];
    fetchedContent.forEach((item) => {
        const newItem = {} as AddOrderContentDTO;
        newItem.colorId = item.color.id;
        newItem.productId = item.product.id;
        newItem.quantity = item.quantity;
        initialContentToAdd.push(newItem);
    })
    content.value = initialContentToAdd;
}

async function initCustomersOptions() {
    const customers = (await fetchAllCustomers());
    for (let i = 0; i < customers.length; i++) {
        let option = {} as SearchSelectOption;
        option.id = customers[i].id;
        const firstName = customers[i].firstName;
        const lastName = customers[i].lastName;
        const companyName = customers[i].companyName;
        option.value = computeSearchSelectValueForCustomer(firstName, lastName, companyName);
        customersOptions.value.push(option);
    }
}

function computeSearchSelectValueForCustomer(firstName: string, lastName: string, companyName: string) {
    return `${firstName} ${lastName}, ${companyName}`;
}

async function updateSelectedCustomers(selectedOption: SearchSelectOption) {
    const selectedCustomerId = selectedOption.id;
    customer.value = (await fetchCustomerById(selectedCustomerId));
}

function addContent(newContent: OrderContentSearchSelectType) {
    contentToDisplay.value.push(newContent);

    const contentToAdd = computeNewContentDTO(newContent);
    content.value.push(contentToAdd);
}

function computeNewContentDTO(newContent: OrderContentSearchSelectType) {
    const contentToAdd = {} as AddOrderContentDTO;
    contentToAdd.productId = newContent.product.id;
    contentToAdd.colorId = newContent.color.id;
    contentToAdd.quantity = newContent.quantity;
    return contentToAdd;
}

function deleteContent(contentToDelete: OrderContentSearchSelectType) {
    const index = contentToDisplay.value.indexOf(contentToDelete);
    if (index > -1) {
        contentToDisplay.value.splice(index, 1);
        content.value.splice(index, 1);
    }
}

async function saveOrder() {
    const order = {} as OrderDTO;
    order.customerId = customer.value!.id;
    order.details = details.value;
    order.dueDate = dueDate.value!.toISOString().substring(0, 10);
    order.content = content.value;
    if (props.editedOrder) {
        await updateOrder(props.editedOrder.id, order);
    } else {
        await addOrder(order);
    }
    emit('form-submitted');
}

function clearFields() {
    customerFilterText.value = "";
    customer.value = null;
    dueDate.value = null;
    details.value = "";
    contentSearchSelect.value?.clearFields();
}
</script>

<template>
    <div class="order-form-container">
        <form @submit.prevent>
            <div class="customer-details">
                <div class="search-customer-wrapper">
                    <SearchSelect
                        :options="customersOptions"
                        v-model="customerFilterText"
                        label="Choose customer"
                        :required="true"
                        @send-option="updateSelectedCustomers"
                    />
                </div>
                <div 
                    v-if="customer"
                    class="customer-details"
                >
                    <span class="customer-prop-label">Company Name: </span>
                    <span class="customer-prop-value">{{customer.companyName}}</span>
                    
                    <span class="customer-prop-label">Representative Name: </span>
                    <span class="customer-prop-value">{{customer.firstName}} {{customer.lastName}}</span>

                    <span class="customer-prop-label">T.I.N.: </span>
                    <span class="customer-prop-value">{{customer.cui}}</span>

                    <span class="customer-prop-label">Email: </span>
                    <span class="customer-prop-value">{{customer.email}}</span>

                    <span class="customer-prop-label">Phone Number: </span>
                    <span class="customer-prop-value">{{customer.phoneNumber}}</span>

                    <span class="customer-prop-label">Billing Addres: </span>
                    <span class="customer-prop-value">{{customer.billingAddress}}</span>

                    <span class="customer-prop-label">Delivery Address: </span>
                    <span class="customer-prop-value">{{customer.deliveryAddress}}</span>
                </div>
            </div>
            <div class="content">
                <div class="add-content-wrapper">
                    <OrderContentSearchSelect 
                        ref="contentSearchSelect"
                        @add-content="addContent"
                    />
                </div>
                <div class="show-content-wrapper">
                    <div 
                        class="item"
                        v-for="item in contentToDisplay"
                        :key="item.product.id"
                    >   
                        <OrderContentCard 
                            :item="item"
                            @delete-content="deleteContent"
                        />
                    </div>
                </div>
            </div>
            <div class="details">
                <div class="datepicker-wrapper">
                    <Datepicker 
                        v-model="dueDate"
                        :text-input="false"
                        required
                        placeholder="Select Due Date"
                        :minDate="new Date()"
                        auto-apply
                        utc
                    />
                </div>
                <div class="textarea-wrapper">
                    <InputTextarea
                        v-model="details"
                        :required="false"
                        :cols="25"
                        :rows="25"
                    />
                </div>
            </div>
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
            <div class="clear-button-wrapper">
                <SimpleButton
                    class="clear-button"
                    label="Clear All"
                    @click="clearFields"
                />
            </div>
        </form>
    </div>
</template>

<style scoped lang="less">
.order-form-container {
    background-color: white;
}
form {
    display: grid;
    grid-auto-flow: column;
    grid-auto-rows: 1fr;
}

.add-button-wrapper {
    position: absolute;
    bottom: 5%;
    right: 5%;
}
.add-button {
    background-color: #22c55e;
    color: white;
    &:hover {
        border: 1px solid black;
        color: black;
    }
    &:disabled {
        border-color: transparent;
        color: white;
        opacity: 0.5;
    }
}
.cancel-button-wrapper {
    position: absolute;
    bottom: 5%;
    right: 15%;
}
.cancel-button {
    background-color: #a9b2bd;
    color: white;
    &:hover {
        border: 1px solid black;
        color: black;
    }
}
.clear-button-wrapper {
    position: absolute;
    bottom: 5%;
    left: 5%;
}
.clear-button {
    background-color: #60a5fa;// rgb(185, 184, 184);
    color: white;
    &:hover {
        border: 1px solid black;
        color: black;
    }
}
</style>