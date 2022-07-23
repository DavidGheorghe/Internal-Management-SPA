<script setup lang="ts">
import CustomerForm from '@/components/forms/CustomerForm.vue';
import CustomModal from '@/components/visual/CustomModal.vue';
import SimpleButton from '@/components/buttons/SimpleButton.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isModalDisplayed = ref(false);

function displayModal() {
    isModalDisplayed.value = true;
}
function hideModal() {
    isModalDisplayed.value = false;
}
</script>

<template>
<div class="add-customer">
    <h3 class="title">Add new customer</h3>
    <CustomerForm 
        class="customer-form"
        @form-submitted="displayModal"
    />
    <Teleport to="#modals">
        <CustomModal 
                :display="isModalDisplayed"
                @x-button-click="router.back"
                @hidden-modal="router.back"
            >
            <template v-slot:title>
                <h2>Customer added successfully!</h2>
            </template>
            <template v-slot:text>
                <h4>Would you like to add another customer?</h4>
            </template>
            <template v-slot:cancel-button>
                <SimpleButton 
                    class="no-button"
                    label="No"
                    @click="router.back"
                />
            </template>
            <template v-slot:ok-button>
                <SimpleButton 
                    class="yes-button"
                    label="Yes"
                    @click="hideModal"
                />
            </template>
        </CustomModal>
    </Teleport>
</div>
</template>

<style lang="less" scoped>
.title {
    text-align: center;
    font-family: TimesNewRoman, "Times New Roman", Times;
    font-size: 1.9rem;
}
.add-customer {
    overflow: hidden;
    background-color: #efefef;
}

.customer-form {
    position: fixed;
    height: 75%;
    width: 50%;
    left: 25%;
}
</style>