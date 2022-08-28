<script setup lang="ts">
import { useIsCurrentUserSupervisor } from '@/composables/rolesComposables';
import { Customer } from '@/types/CustomerTypes';
import { ref } from '@vue/reactivity';
import { ElNotification } from 'element-plus';
import ActionButton from '../buttons/ActionButton.vue';
import SimpleButton from '../buttons/SimpleButton.vue';
import SubmitButton from '../buttons/SubmitButton.vue';

const props = defineProps<{
    customer: Customer
}>();

const emits = defineEmits<{
    (e: 'customer-edited', customer: Customer): void,
    (e: 'customer-deleted', customer: Customer): void,
}>();

const fullName = `${props.customer.firstName} ${props.customer.lastName}`;// computed(() => `${props.customer.firstName} ${props.customer.lastName}`);
const areFieldsEditable = ref(false);
const customerAux = ref<Customer>(props.customer);
const isCurrentUserSupervisor = useIsCurrentUserSupervisor();

function setFieldsEditable() {
    areFieldsEditable.value = true;
}

function setFieldsUneditable() {
    areFieldsEditable.value = false
}

function updateCompanyName(event: Event) {
    const element = event.currentTarget as HTMLElement;
    customerAux.value.companyName = element.innerText;
    preventLineBreakOnEnter(event);
}
function updateFirstName(event: Event) {
    const element = event.currentTarget as HTMLElement;
    customerAux.value.firstName = element.innerText;
    preventLineBreakOnEnter(event);
}
function updateLastName(event: Event) {
    const element = event.currentTarget as HTMLElement;
    customerAux.value.lastName = element.innerText;
    preventLineBreakOnEnter(event);
}
function updatePhoneNumber(event: Event) {
    const element = event.currentTarget as HTMLElement;
    customerAux.value.phoneNumber = element.innerText;
    preventLineBreakOnEnter(event);
}

function updateBillingAddress(event: Event) {
    const element = event.currentTarget as HTMLElement;
    customerAux.value.billingAddress = element.innerText;
    preventLineBreakOnEnter(event);
}

function updateDeliveryAddress(event: Event) {
    const element = event.currentTarget as HTMLElement;
    customerAux.value.deliveryAddress = element.innerText;
    preventLineBreakOnEnter(event);
}

function updateEmail(event: Event) {
    const value = getInnerTextFromEvent(event);
    customerAux.value.email = value;
    preventLineBreakOnEnter(event);
}

function updateCUI(event: Event) {
    const element = event.currentTarget as HTMLElement;
    customerAux.value.cui = element.innerText;
    preventLineBreakOnEnter(event);
}

function saveChanges() {
    emits('customer-edited', customerAux.value);
    customerEditedSuccessfully();
    setFieldsUneditable();
}

function cancelEdit() {
    customerAux.value = props.customer;
    setFieldsUneditable();
}

function deleteCustomer() {
    emits('customer-deleted', customerAux.value);
}

function getInnerTextFromEvent(event: Event) {
    const element = event.currentTarget as HTMLElement;
    return element.innerText;
}

function preventLineBreakOnEnter(event: Event) {
    const keyEvent = event as KeyboardEvent;
    if (keyEvent.key === "Enter") {
        keyEvent.preventDefault();
    }
}

const customerEditedSuccessfully = () => {
    ElNotification({
        title: 'Customer Updated',
        position: 'bottom-right',
        type: 'success',
        offset: 100
    });
}
</script>

<template>
    <div class="customer-card-container">
        <div class="details">
            <div class="company-name-wrapper">
                <span 
                    :contenteditable="areFieldsEditable"
                    :class="{'editable': areFieldsEditable}"
                    @blur="updateCompanyName"
                    @keydown.enter="updateCompanyName"
                >
                    <strong>{{customerAux.companyName}}</strong>
                </span>
            </div>
            <div class="full-name-wrapper">
                <div v-if="areFieldsEditable === false">
                    <span class="label">Representative Name: </span>
                    <span 
                        class="value"
                        :class="{'editable': areFieldsEditable}"
                        :contenteditable="areFieldsEditable"
                    >
                        {{fullName}}
                    </span>
                </div>
                <div
                    v-else
                    class="names-wrapper"
                >
                    <div class="first-name-wrapper">
                        <span class="label">First Name: </span>
                        <span 
                            class="value"
                            :class="{'editable': true}"
                            :contenteditable="true"
                            @blur="updateFirstName"
                            @keydown.enter="updateFirstName"
                        >
                            {{customerAux.firstName}}
                        </span>
                    </div>
                    <div class="last-name-wrapper">
                        <span class="label">Last Name: </span>
                        <span 
                            class="value"
                            :class="{'editable': true}"
                            :contenteditable="true"
                            @blur="updateLastName"
                            @keydown.enter="updateLastName"
                        >
                            {{customerAux.lastName}}
                        </span>
                    </div>
                </div>
            </div>
            <div class="cui-wrapper">
                <span class="label">T.I.N: </span>
                <span 
                    class="value"
                    :class="{'editable': areFieldsEditable}"
                    :contenteditable="areFieldsEditable"
                    @blur="updateCUI"
                    @keydown.enter="updateCUI"
                >
                    {{customerAux.cui}}
                </span>
            </div>
        </div>
        <div class="contact">
            <div class="email-wrapper">
                <span class="label">E-mail: </span>
                <span 
                    class="value"
                    :class="{'editable': areFieldsEditable}"
                    :contenteditable="areFieldsEditable"
                    @blur="updateEmail"
                    @keydown.enter="updateEmail"
                >
                    {{customerAux.email}}
                </span>
            </div>
            <div class="phone-number-wrapper">
                <span class="label">Phone Number: </span>
                <span 
                    class="value"
                    :class="{'editable': areFieldsEditable}"
                    :contenteditable="areFieldsEditable"
                    @blur="updatePhoneNumber"
                    @keydown.enter="updatePhoneNumber"
                >
                    {{customerAux.phoneNumber}}
                </span>
            </div>
        </div>
        <div class="addresses">
            <div class="billing-address-wrapper">
                <span class="label">Billing Address: </span>
                <span 
                    class="value"
                    :class="{'editable': areFieldsEditable}"    
                    :contenteditable="areFieldsEditable"
                    @blur="updateBillingAddress"
                    @keydown.enter="updateBillingAddress"
                >
                    {{customerAux.billingAddress}}
                </span>
            </div>
            <div class="delivery-address-wrapper">
                <span class="label">Delivery Address: </span>
                <span 
                    class="value"
                    :class="{'editable': areFieldsEditable}"    
                    :contenteditable="areFieldsEditable"
                    @blur="updateDeliveryAddress"
                    @keydown.enter="updateDeliveryAddress"
                >
                    {{customerAux.deliveryAddress}}
                </span>
            </div>
        </div>
        <div 
            v-if="areFieldsEditable === false"
            class="action-buttons-wrapper"
        >
            <ActionButton
                class="edit-button"
                label="Edit"
                action-type="edit"
                :disabled="isCurrentUserSupervisor === false"
                @click="setFieldsEditable"
            />
            <ActionButton
                class="delete-button"
                label="Delete"
                action-type="delete"
                :disabled="isCurrentUserSupervisor === false"
                @click="deleteCustomer"
            />
        </div>
        <div
            v-else
            class="editable-action-buttons"
        >
            <SimpleButton 
                class="cancel-button"
                label="Cancel"
                @click="cancelEdit"
            />
            <SubmitButton 
                class="save-button"
                :is-disabled="false"
                label="Save"
                @submit="saveChanges"
            />
        </div>
    </div>
</template>

<style lang="less" scoped>
@import "@/assets/colors.less";

.customer-card-container {
    height: 100%;
    width: 100%;
    border: 1px solid black;
    border-radius: 0.2rem;
    padding: 0.4rem;
    box-shadow: 0.05rem 0.05rem 0.1rem 0.01rem black, -0.05rem -0.05rem 0.1rem 0.01rem rgba(0, 0, 0, 0.103);
    box-sizing: border-box;
    position: relative;
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: 1.5fr 1.25fr 1.75fr 1fr;
}
.details, .addresses, .contact {
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 1fr 1fr 1fr;
    align-items: center;
    justify-items: start;
    .email-wrapper, .billing-address-wrapper{
        grid-row: 2 / 3;
    }
    .phone-number-wrapper, .delivery-address-wrapper {
        grid-row: 3 / 4;
    }
}
.label {
    color: grey;
}
.action-buttons-wrapper, .editable-action-buttons {
    grid-column: 4 / 5;
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: auto;
    align-items: center;
    justify-items: end;
    padding-bottom: 1rem;
    .delete-button {
        width: 5rem;
        height: 2rem;
        background-color: #dc2626;
        align-self: end;
        justify-self: center;
    }
    .edit-button {
        width: 5rem;
        height: 2rem;
        align-self: end;
        justify-self: end;
        background-color: #fde047;
    }
    .cancel-button, .save-button {
        width: 5rem;
        height: 1.75rem;
        font-size: 1.05rem;
        font-weight: 500;
        border: 1px solid black;
        border-radius: 0.3rem;
    }
    .cancel-button {
        align-self: end;
        justify-self: end;
        background-color: #d1d5db;
    }
    .save-button {
        align-self: end;
        justify-self: center;
        background-color: @custom-green;
    }
}
.editable {
    border: 1px solid black;
    border-radius: 0.2rem;
    padding: 0.2rem;
}
.names-wrapper {
    display: flex;
    flex-direction: column;
    > * {
        // padding: 0.2rem;
        margin: 0.2rem;
    }
}
.value {
    margin: 0.2rem;
}
</style>