<script setup lang="ts">
import XButton from '@/components/buttons/XButton.vue';
import SimpleButton from '@/components/buttons/SimpleButton.vue';
import SubmitButton from '@/components/buttons/SubmitButton.vue';
import InputString from '@/components/controls/InputString.vue';
import { computed, ref } from 'vue';
import { changePassword } from '@/services/UserService';
import { ElMessage } from 'element-plus'

defineProps<{
    display: boolean
}>();

const emit = defineEmits<{
    (e: 'hidden-modal'): void,
    (e: 'x-button-click'): void
}>();

const isSaveButtonDisabled = computed(() => {
    let isDisabled: boolean = false;
    if (arePasswordsInputsEmpty()) {
        isDisabled = true;
    } else {
        if (!(doesNewPasswordsMatch()) || doesNewAndCurrentPasswordsMatch()) {
            isDisabled = true;
        }
    }
    return isDisabled;
});

const warningMessage = computed(() => {
    let message: string = "";
    if (!doesNewPasswordsMatch()) {
        message = "New Passwords Does Not Match."
    } 
    if (doesNewAndCurrentPasswordsMatch()) {
        message = "New Password Can Not Be The Same As Current Password.";
    }
    if (incorrectPassword.value === true) {
        message = "The Current Password Is Incorrect.";
    }
    return message;
});

const currentPassword = ref("");
const newPassword = ref("");
const newPasswordConfirmation = ref("");

const incorrectPassword = ref(false);

async function saveNewPassword() {
    try {
        await changePassword(currentPassword.value, newPassword.value);
        emit('hidden-modal');
        currentPassword.value = "";
        newPassword.value = "";
        newPasswordConfirmation.value = "";

        successNotification();
    } catch (error) {
        incorrectPassword.value = true;
    }
}

function doesNewPasswordsMatch() {
    return newPassword.value === newPasswordConfirmation.value;
}

function arePasswordsInputsEmpty() {
    return currentPassword.value === "" || newPassword.value === "" || newPasswordConfirmation.value === "";
}

function doesNewAndCurrentPasswordsMatch() {
    return newPassword.value !== "" && currentPassword.value !== "" && newPassword.value === currentPassword.value;
}

function closeModal() {
    currentPassword.value = "";
    newPassword.value = "";
    newPasswordConfirmation.value = "";
    incorrectPassword.value = false;
    
    emit('hidden-modal');
}

const successNotification = () => {
    ElMessage({
        message: 'Password changed successfully!',
        type: 'success'
    })
}
</script>

<template>
    <Transition>
        <div 
            v-if="display"
            @keydown.esc="$emit('hidden-modal')"
            class="backdrop"
        >
            <div 
                class="content"
            >
                <div class="title-wrapper">
                    <h2 class="title">Change Password</h2>
                    <span 
                        class="warning"
                        v-if="warningMessage !== ''"
                    >
                        {{warningMessage}}
                    </span>
                </div>
                <div class="x-button-wrapper">
                    <XButton @click="closeModal"/>
                </div>
                <div class="passwords">
                    <InputString 
                        class="old-password"
                        v-model="currentPassword"
                        label="Current Password"
                        :required="true"
                        type="password"
                    />
                    <InputString 
                        class="new-password"
                        v-model="newPassword"
                        label="New Password"
                        :required="true"
                        type="password"
                    />
                    <InputString 
                        class="new-password-confirmation"
                        v-model="newPasswordConfirmation"
                        label="Confirm New Password"
                        :required="true"
                        type="password"
                    />
                </div>
                <div class="buttons">
                    <SimpleButton 
                        class="cancel-button"
                        label="Cancel"
                        @click="closeModal"
                    />
                    <SubmitButton 
                        class="save-button"
                        label="Save"
                        :is-disabled="isSaveButtonDisabled"
                        @click="saveNewPassword"
                    />
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped lang="less">
@import "@/assets/colors.less";

.backdrop {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 99999;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.35);
}
.content {
    height: 50%;
    width: 40%;
    background-color: #efefef;
    position: relative;
    border-radius: 0.5rem;
    display: grid;
    grid-template-columns: 1fr 1.5fr 1fr;
    grid-template-rows: 15% 70% 15%;
}
.title-wrapper {
    grid-row: 1 / 2;
    grid-column: 2 / 3;
    text-align: center;
    .warning {
        border: 1px solid @custom-yellow;
        border-radius: 0.5rem;
        padding: 0.5rem;
        font-weight: 500;
        color: #6a0303;
        background-color: #ff000045;
        border: 1px solid #ff00005c;
        font-size: 1.05rem;
    }
}
.passwords {
    grid-row: 2 / 3;
    grid-column: 2 / 3;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}
.buttons {
    grid-row: 3 / 4;
    grid-column: 3 / 4;
    display: grid;
    grid-template-columns: 50% 50%;
    align-items: center;
    justify-items: start;
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
    background-color: #d1d5db;
}
.save-button {
    background-color: @custom-green;
}
.x-button-wrapper {
    position: absolute;
    top: 5px;
    right: 5px;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>