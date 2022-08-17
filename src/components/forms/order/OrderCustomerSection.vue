<script setup lang="ts">
import { fetchAllCustomers, fetchCustomerById } from '@/services/CustomerSerivce';
import { Customer } from '@/types/CustomerTypes';
import { Order } from '@/types/OrderTypes';
import { SearchSelectOption } from '@/types/UtilsTypes';
import { ref, watch } from 'vue';
import SearchSelect from '../../controls/SearchSelect.vue';

const props = defineProps<{
    editedOrder?: Order,
}>();

const emit = defineEmits<{
    (e: 'update-customer', newCustomer: Customer | null): void
}>();

const customersOptions = ref<SearchSelectOption[]>([]);
const customer = ref<Customer | null>(props.editedOrder?.customer || null);
const customerFilterText = ref<string>("");

(await initCustomersOptions());

if (props.editedOrder) {
    initCustomerFilterText(props.editedOrder);
}

function initCustomerFilterText(order: Order) {
    const companyName = order.customer.companyName;
    const firstName = order.customer.firstName;
    const lastName = order.customer.lastName;
    const customerSearchSelectValue = computeSearchSelectValueForCustomer(lastName, firstName, companyName);
    customerFilterText.value = customerSearchSelectValue;
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

function clearSearchFilter() {
    customer.value = null;
    customerFilterText.value = "";
}

defineExpose({
    clearSearchFilter,
    customer
});

watch(customer, () => {
    emit('update-customer', customer.value);
})
</script>

<template>
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
            class="customer-credentials"
        >
            <div>
                <span class="customer-prop-label">Company Name: </span>
                <span class="customer-prop-value">{{customer?.companyName ?? 'N/A'}}</span>
            </div>
            <div>
                <span class="customer-prop-label">Representative Name: </span>
                <span class="customer-prop-value">{{customer ? `${customer.firstName} ${customer.lastName}` : 'N/A' }}</span>
            </div>
            <div>
                <span class="customer-prop-label">T.I.N.: </span>
                <span class="customer-prop-value">{{customer?.cui ?? 'N/A'}}</span>
            </div>
            <div>
                <span class="customer-prop-label">Email: </span>
                <span class="customer-prop-value">{{customer?.email ?? 'N/A'}}</span>
            </div>
            <div>
                <span class="customer-prop-label">Phone Number: </span>
                <span class="customer-prop-value">{{customer?.phoneNumber ?? 'N/A'}}</span>
            </div>
            <div>
                <span class="customer-prop-label">Billing Addres: </span>
                <span class="customer-prop-value">{{customer?.billingAddress ?? 'N/A'}}</span>
            </div>
            <div>
                <span class="customer-prop-label">Delivery Address: </span>
                <span class="customer-prop-value">{{customer?.deliveryAddress ?? 'N/A'}}</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
.customer-credentials {
    display: flex;
    flex-direction: column;
    font-size: 1.07rem;
    margin-top: 2rem;
    padding-left: 2.5rem;
    .customer-prop-label {
        color: grey;
    }
    > * {
        padding: 0.2rem;
    }
}
</style>