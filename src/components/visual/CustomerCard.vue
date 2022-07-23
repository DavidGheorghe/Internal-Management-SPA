<script setup lang="ts">
import { Customer } from '@/types/CustomerTypes';
import { computed, Ref, ref } from '@vue/reactivity';
import ActionButton from '../buttons/ActionButton.vue';
import SubmitButton from '../buttons/SubmitButton.vue';
import SimpleButton from '../buttons/SimpleButton.vue';

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
            >{{customerAux.companyName}}</span>
        </div>
        <div class="full-name-wrapper">
            <div v-if="areFieldsEditable === false">
                <span class="label">Representative Name: </span>
                <span 
                    :contenteditable="areFieldsEditable"
                    :class="{'editable': areFieldsEditable}"
                >{{fullName}}</span>
            </div>
            <div
                v-else
                class="names-wrapper"
            >
                <div class="first-name-wrapper">
                    <span class="label">First Name: </span>
                    <span 
                        :contenteditable="true"
                        :class="{'editable': true}"
                        @blur="updateFirstName"
                        @keydown.enter="updateFirstName"
                    >{{customerAux.firstName}}</span>
                </div>
                <div class="last-name-wrapper">
                    <span class="label">Last Name: </span>
                    <span 
                        :contenteditable="true"
                        :class="{'editable': true}"
                        @blur="updateLastName"
                        @keydown.enter="updateLastName"
                    >{{customerAux.lastName}}</span>
                </div>
            </div>
        </div>
        <div class="cui-wrapper">
            <span class="label">T.I.N: </span>
            <span 
                :contenteditable="areFieldsEditable"
                :class="{'editable': areFieldsEditable}"
                @blur="updateCUI"
                @keydown.enter="updateCUI"
            >{{customerAux.cui}}</span>
        </div>
    </div>
    <div class="contact">
        <div class="email-wrapper">
            <span class="label">E-mail: </span>
            <span 
                :contenteditable="areFieldsEditable"
                :class="{'editable': areFieldsEditable}"
                @blur="updateEmail"
                @keydown.enter="updateEmail"
            >{{customerAux.email}}</span>
        </div>
        <div class="phone-number-wrapper">
            <span class="label">Phone Number: </span>
            <span 
                :contenteditable="areFieldsEditable"
                :class="{'editable': areFieldsEditable}"
                @blur="updatePhoneNumber"
                @keydown.enter="updatePhoneNumber"
            >{{customerAux.phoneNumber}}</span>
        </div>
    </div>
    <div class="addresses">
        <div class="billing-address-wrapper">
            <span class="label">Billing Address: </span>
            <span 
                :contenteditable="areFieldsEditable"
                :class="{'editable': areFieldsEditable}"    
                @blur="updateBillingAddress"
                @keydown.enter="updateBillingAddress"
            >{{customerAux.billingAddress}}</span>
        </div>
        <div class="delivery-address-wrapper">
            <span class="label">Delivery Address: </span>
            <span 
                :contenteditable="areFieldsEditable"
                :class="{'editable': areFieldsEditable}"    
                @blur="updateDeliveryAddress"
                @keydown.enter="updateDeliveryAddress"
            >{{customerAux.deliveryAddress}}</span>
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
            @click="setFieldsEditable"
        />
        <ActionButton
            class="delete-button"
            label="Delete"
            action-type="delete"
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
.customer-card-container {
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
.details, .addresses, .contact {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-start;
    > * {
        padding: 1%; 
    }
}
.label {
    color: grey;
}
.action-buttons-wrapper {
    position: absolute;
    right: 2%;
    bottom: 15px;
    display: flex;
    flex-direction: row;
}
.editable-action-buttons {
    position: absolute;
    right: 2%;
    bottom: 15px;
    display: flex;
    flex-direction: row;
}
.edit-button, .cancel-button {
    margin-right: 15px;
    // width: 80px;
}
.cancel-button, .save-button {
    border: 1px solid black;

}
.editable {
    border: 1px solid black;
}
.names-wrapper {
    display: flex;
    flex-direction: column;
}
</style>