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
        <div class="content">
            <!-- <div class="details-section">
                <div class="company-name-and-cui-wrapper"> -->
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
                <!-- </div> -->
                <!-- <div class="names-wrapper"> -->
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
                <!-- </div> -->
            <!-- </div> -->
            <!-- <div class="contact-section"> -->
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
            <!-- </div> -->
            <!-- <div class="addresses-section"> -->
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
            <!-- </div> -->
        </div>
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
                    :is-disabled="isSubmitButtonDisabled"
                    @submit="saveCustomer"
                />
            </div>
        </div>
    </form>
</div>
</template>

<style scoped lang="less">
@import "@/assets/colors.less";

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
    grid-template-rows: auto 5rem;
    grid-template-columns: 25% 40% 35%;
}
.content {
    grid-row: 1 / 2;
    grid-column: 1 / 4;
    display: grid;
    grid-template-rows: 25% 25% 25% 25%;
    grid-template-columns: 50% 50%;
    justify-items: center;
    align-items: center;
    > * {
        width: 20rem;
    }
}
.cancel-and-save-buttons-wrapper {
    grid-column: 3 / 4;
    display: grid;
    grid-template-columns: 50% 50%;
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
.add-button-wrapper {
    align-self: center;
    justify-self: center;
    padding-right: 6rem;
    padding-bottom: 1rem;

}
.add-button {
    background-color: @custom-green;
    &:disabled {
        border-color: transparent;
        color: white;
        opacity: 0.5;
        box-shadow: none;
    }
}
.cancel-button-wrapper {
    align-self: center;
    justify-self: center;
    padding-bottom: 1rem;
}
.cancel-button {
    background-color: #a9b2bd;
}
.clear-button-wrapper {
    align-self: center;
    justify-self: center;
    padding-left: 1rem;
    padding-bottom: 1rem;

}
.clear-button {
    background-color: @custom-blue;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
}
</style>