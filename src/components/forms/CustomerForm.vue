<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { computed } from '@vue/reactivity';
import { CustomerDTO } from '@/types/CustomerTypes';
import { addCustomer } from '@/services/CustomerSerivce';
import SubmitButton from '../buttons/SubmitButton.vue';
import InputString from '../controls/InputString.vue';
import SimpleButton from '../buttons/SimpleButton.vue';

const emits = defineEmits<{
    (e: 'form-submitted'): void
}>();

const router = useRouter();

const companyName = ref("");
const firstName = ref("");
const lastName = ref("");
const cui = ref("");
const phoneNumber = ref("");
const email = ref("");
const billingAddress = ref("");
const deliveryAddress = ref("");

const isSubmitButtonDisabled = computed(() => companyName.value === "" && companyName.value === "" && 
        companyName.value === "" && companyName.value === "" && 
        companyName.value === "" && companyName.value === "" && 
        companyName.value === "" && companyName.value === ""); 

function saveCustomer() {
    const customer = {} as CustomerDTO;
    customer.companyName = companyName.value;
    customer.firstName = firstName.value;
    customer.lastName = lastName.value;
    customer.cui = cui.value;
    customer.email = email.value;
    customer.phoneNumber = phoneNumber.value;
    customer.billingAddress = billingAddress.value;
    customer.deliveryAddress = deliveryAddress.value;
    addCustomer(customer);
    emits('form-submitted');
}

function clearFields() {
    companyName.value = "";
    firstName.value = "";
    lastName.value = "";
    cui.value = "";
    email.value = "";
    phoneNumber.value = "";
    billingAddress.value = "";
    deliveryAddress.value = "";
}
</script>

<template>
<div class="customer-form-container">
    <form @submit.prevent>
        <div class="details-section">
            <div class="company-name-and-cui-wrapper">
                <InputString
                    :required="true"
                    v-model="companyName"
                    label="Company Name"
                />
                <InputString
                    :required="true"
                    v-model="cui"
                    label="T.I.N."
                />
            </div>
            <div class="names-wrapper">
                <InputString
                    :required="true"
                    v-model="firstName"
                    label="Representative's First Name"
                />
                <InputString
                    :required="true"
                    v-model="lastName"
                    label="Representative's Last Name"
                />
            </div>
        </div>
        <div class="contact-section">
            <InputString
                :required="true"
                v-model="email"
                label="Email"
                type="email"
            />
            <InputString
                :required="true"
                v-model="phoneNumber"
                label="Phone Number"
            />
        </div>
        <div class="addresses-section">
            <InputString
                :required="true"
                v-model="billingAddress"
                label="Billing Address"
            />
            <InputString
                :required="true"
                v-model="deliveryAddress"
                label="Delivery Address"
            />
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
                :is-disabled="isSubmitButtonDisabled"
                @submit="saveCustomer"
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
.customer-form-container {
    height: 100%;
    width: 100%;
    border-radius: 5px;
    border: 1px solid #efefef;
    background-color: white;
    box-shadow: 2px 2px 2px 2px #959da0;
}
form {
    height: 100%;
    box-sizing: border-box;
    display: grid;
    grid-auto-flow: row;
    grid-auto-rows: 1fr;
}
.details-section, .contact-section, .addresses-section {
    display: flex;
    // flex-direction: row;
    align-items: center;
    justify-content: space-around;
}
.details-section {
    > * {
        flex-basis: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
    }
}
.add-button-wrapper {
    /* height: 10%; */
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