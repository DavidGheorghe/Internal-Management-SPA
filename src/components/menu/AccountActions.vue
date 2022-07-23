<script setup lang="ts">
import { useUserStore } from '@/stores/UserStore';
import { ref } from 'vue';

const props = defineProps<{
    display: boolean
}>();

const user = useUserStore();
const isMouseOnContainer = ref(false);

const rolesStr = user.currentUserRoles.join(', ');

const emits = defineEmits<{
    (e: 'mouseHovered', value: boolean): void,
    (e: 'logout'): void
}>();

function logOut() {
    emits('logout');
    user.logOut();
}
</script>

<template>
<div
    v-if="display"
    @mouseenter="" 
    class="account-actions-container">
    <header>
        <span class="username">{{user.getCurrentUsername}}</span>
        <span class="roles">{{rolesStr}}</span>
    </header>
    <div class="actions">
        <button type="button" class="action">
            <span>Change Password</span>
        </button>
        <button 
            type="button" 
            class="action logout"
            @click="logOut"
        >
        <span class="material-symbols-outlined">logout</span>
        Log Out
        </button>
    </div>
</div>
</template>

<style lang="less" scoped>
.account-actions-container {
    position: absolute;
    height: 15%;
    width: 8%;
    right: 1vw;
    top: 8vh;
    background-color: #fafafa;
    border: 1px solid rgb(155, 155, 155);
    border-radius: 5px;

    &::before {
        content: "";
        position: absolute;
        height: 10px;
        width: 10px;
        right: 20px;
        top: -7px;
        border-top: 1px solid rgb(155, 155, 155);
        border-left: 1px solid rgb(155, 155, 155);
        background: #fafafa;
        transform: rotate(45deg);
    }

    
}
header span {
    display: block;
    text-align: center;
}
.username {
    font-size: 1.8rem;
}
.roles {
    font-size: 0.8rem;
    color: grey;
}

main {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    bottom: 10%;
    width: 100%;
    box-sizing: border-box;
}
.actions {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    bottom: 10%;
    width: 100%;
    box-sizing: border-box;
}

.action {
    all: unset;
    display: inline-block;
    padding: 5px 0 5px 0;
    width: 100%;
    text-align: center; 
    cursor: pointer;
    &:hover {
        background-color: #e7e7e7;
        color: black;
    }
}
// .action::after {
//     content: "";
//     position: relative;
//     box-sizing: border-box;
//     width: 70%;
//     border-bottom: 1px solid rgb(206, 204, 204);
// }
.action.logout {
    display: inline-flex;
    justify-content: center;
    align-items: center;
}

// .action:first-child::after {
//     border-bottom: 0;
// }

.action.logout {
    cursor: pointer;
}
</style>