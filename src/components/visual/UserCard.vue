<script setup lang="ts">
import { User } from '@/types/UserTypes';
import ActionButton from '../buttons/ActionButton.vue';

const props = defineProps<{
    user: User
}>();

defineEmits<{
    (e: 'delete-user'): void
}>();

const rolesStr = props.user.roles.join(', ');

</script>

<template>
    <div class="container">
        <div class="username-wrapper">
            <span class="label">Username: </span>
            <span class="value">{{user.username}}</span>
        </div>
        <div class="roles-wrapper">
            <span class="label">Roles: </span>
            <span class="value">{{rolesStr}}</span>
        </div>
        <div class="delete-button-wrapper">
            <ActionButton 
                class="delete-button"
                action-type="delete"
                @click="$emit('delete-user')"
            />
        </div>
    </div>
</template>

<style scoped lang="less">
@import "@/assets/colors.less";
.container {
    width: 90%;
    border: 1px solid black;
    border-radius: 0.2rem;
    padding: 0.9rem;
    display: grid;
    grid-template-columns: auto 5rem;
    grid-template-rows: 50% 50%;
    > * {
        margin: 0.2rem;
    }
}
.username-wrapper {
    grid-row: 1 / 2;
    grid-column: 1 / 2;
}
.roles-wrapper {
    grid-row: 2 / 3;
    grid-column: 1 / 2;
}
.label {
    color: grey;
}
.delete-button-wrapper {
    grid-column: 2 / 3;
    grid-row: 1 / -1;
    align-self: center;
    justify-self: center;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.delete-button {
    background-color: @custom-red;
    height: 60%;
    width: 50%;
    align-self: center;
    justify-self: end;
}
</style>
