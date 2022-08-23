<script setup lang="ts">
import SimpleButton from '@/components/buttons/SimpleButton.vue';
import SubmitButton from '@/components/buttons/SubmitButton.vue';
import XButton from '@/components/buttons/XButton.vue';
import InputString from '@/components/controls/InputString.vue';
import { createUser } from '@/services/UserService';
import { Role } from '@/types/Role';
import { CreateUserDTO } from '@/types/UserTypes';
import { getIdsFromRoles } from '@/utils/Utils';
import { computed, ref } from 'vue';
import RolesSelect from '../controls/RolesSelect.vue';

defineProps<{
    display: boolean
}>();

const emit = defineEmits<{
    (e: 'hide-modal'): void,
    (e: 'x-button-click'): void,
    (e: 'add-user'): void
}>();

const username = ref("");
const roles = ref<Role[]>([]);

const isSaveButtonDisabled = computed(() => username.value === "" || roles.value.length === 0);

function closeModal() {
    username.value = "";
    roles.value = [];
    
    emit('hide-modal');
}

async function saveNewUser() {
    try {
        const newUser: CreateUserDTO = {
            username: username.value,
            rolesIds: getIdsFromRoles(roles.value)
        }
        await createUser(newUser);
        emit('add-user');
    } catch (error) {
        console.log(error);
    } finally {
        closeModal();
    } 

}

// function getIdsFromRoles(): number[] {
//     const ids: number[] = [];
//     for (let i = 0; i < roles.value.length; i++) {
//         ids.push(roles.value[i]);
//         console.log(typeof ids[i]);
//     }
//     return ids;
// }
</script>

<script lang="ts">
    export default {
        inheritAttrs: false
    }
</script>

<template>
    <transition>
        <div 
            class="backdrop"
            v-if="display"
        >
            <div class="content">
                <div class="x-button-wrapper">
                    <XButton @click="$emit('hide-modal')"/>
                </div>
                <div class="title-wrapper">
                    <h2 class="title">Create new user</h2>
                </div>
                <div class="inputs-wrapper">
                    <InputString 
                        v-model="username"
                        placeholder="Username*"
                        :required="true"
                    />
                    <RolesSelect 
                        v-model:roles="roles"
                    />
                </div>
                <div class="buttons-wrapper">
                    <SimpleButton 
                        class="cancel-button"
                        label="Cancel"
                        @click="closeModal"
                    />
                    <SubmitButton 
                        class="save-button"
                        label="Save"
                        :is-disabled="isSaveButtonDisabled"
                        @click="saveNewUser"
                    />
                </div>
            </div>
        </div>
    </transition>
</template>

<style lang="less" scoped>
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
    height: 40%;
    width: 40%;
    background-color: #efefef;
    position: relative;
    border-radius: 0.5rem;
    display: grid;
    grid-template-columns: 0.75fr 1.5fr 0.75fr;
    grid-template-rows: 0.75fr 1.5fr 0.75fr;
}
.title-wrapper {
    grid-row: 1 / 2;
    grid-column: 2 / 3;
    align-self: center;
    justify-self: center;
}
.inputs-wrapper {
    grid-row: 2 / 3;
    grid-column: 2 / 3;
    align-self: center;
    justify-self: center;
}
.buttons-wrapper {
    grid-row: 3 / 4;
    grid-column: 3 / 4;
    align-self: center;
    justify-self: center;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 50% 50%;
    align-items: center;
    justify-items: center;
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
    &:disabled {
        &:hover {
            box-shadow: none;
            cursor: default;
        }
    }
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
