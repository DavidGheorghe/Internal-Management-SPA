<script setup lang="ts">
import AccountActions from '@/components/menu/AccountActions.vue';
import Logo from '@/components/visual/Logo.vue';
import { useUserStore } from '@/stores/UserStore';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const user = useUserStore();
const router = useRouter();

const areUserActionsDisplayed = ref(false);
const isCursorOverAccountActions = ref(false);

const items = computed(() => router.getRoutes().filter(route => {
    let isInNavBar: boolean = false;
    if (route.meta.isInNavbar === true) {
        const requiredRoles: string[] | undefined = route.meta.requiredRoles;
        const currentUserRoles = user.getCurrentUserRoles;
        if (requiredRoles !== undefined) {
            for (let i = 0; i < currentUserRoles.length; i++) {
                const role = currentUserRoles[i];
                if (requiredRoles.includes(role.toString())) {
                    isInNavBar = true;
                    break;
                }
            }
        }
    }
    return isInNavBar;
}))

function toggleActions(): void {
    areUserActionsDisplayed.value = !areUserActionsDisplayed.value;
}

function displayActions() {
    areUserActionsDisplayed.value = true;
}

function hideActions(e: Event) {
    if (isCursorOverAccountActions.value === false) {
        setTimeout(() => {}, 1000);
        areUserActionsDisplayed.value = false;
    }
}

function handleLogOut() {
    areUserActionsDisplayed.value = false;
    user.logOut();
}

function goToHome() {
    router.push("/");
}
</script>

<template>
    <div class="navbar-container">
        <div class="logo">
            <Logo 
                :class="['logo']"
                @click="goToHome"
            />
        </div>
        <div class="nav-bar-wrapper">
            <nav class="nav-bar">
                <router-link class="item" v-for="item in items" :key="item.path" :to="item.path" active-class="current-item">
                    {{item.name}}
                </router-link>
            </nav>
        </div>
        <div class="account-actions">
            <button 
                class="material-symbols-outlined"
                @click="toggleActions"
                @focusout="hideActions"
            >
                account_circle
            </button>
            <Teleport
                to="#account-actions"
            >
                <AccountActions
                    :display="areUserActionsDisplayed"
                    @mouseenter="isCursorOverAccountActions = true"
                    @mouseleave="isCursorOverAccountActions = false"
                    @logout="handleLogOut"
                />
            </Teleport>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0");

.navbar-container {
    position: fixed;
    background-color: #fffffc;
    top: 0;
    left: 0;
    width: 100%;
    height: 7vh;
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid #cbcbcb;
    justify-content: center;
    z-index: 99999;
}
.logo {
    position: absolute;
    left: 0.2rem;
    display: flex;
    height: 100%;
}

.logo {
    height: 100%;
    width: 4vw;
    &:hover {
        cursor: pointer;
    }
}
.nav-bar {
    display: flex;
    flex-direction: row;
    height: 7vh;
    align-items: center;
    justify-content: center;
}

.item {
    color: black;// #8d8d8d !important;
    width: 100%;
    height: 60%;
    text-align: center;
    margin: 0;
    position: relative;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
}

.item::after {
    content: "";
    position: absolute;
    left: 0;
    height: 100%;
    border-left: 1px solid #c5c5c5;
}

.item:first-child::after {
    border-left: 0;
}

.item:hover {
    cursor: pointer;
    // color: white;
    background-color: #efefef;
}

a {
    position: relative;
    display: inline-block;
    width: 100%;
    text-decoration: none;
    font-size: 1vw;
    padding: 5px 10px 5px 10px;
}
.current-item {
    background-color: #efefef;
    color: #000000 !important;
}
a:visited {
    color: inherit;
}

.item:active {
    color: black;
}

.account-actions {
    position: absolute;
    right: 0;
    height: 100%;
    width: 5%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.material-symbols-outlined {
    font-size: 45px;
    cursor: pointer;
    color: #8d8d8d;
    background-color: inherit;
    border: 0;
    &:hover, &:focus {
        color: black;
    }
}

.firm-name {
    font-family: "Rockwell", "Courier Bold", Courier;
    font-size: 26px;
    white-space: pre-line;
    padding-left: 3%;
    span {
        display: block;
    }
}
</style>