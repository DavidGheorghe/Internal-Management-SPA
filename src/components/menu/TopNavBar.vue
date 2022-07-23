<script setup lang="ts">
import router from '@/router';
import { useUserStore } from '@/stores/UserStore';
import { ref } from 'vue';
import Logo from '@/components/visual/Logo.vue';
import AccountActions from '@/components/menu/AccountActions.vue';

const user = useUserStore();

const areUserActionsDisplayed = ref(false);

// const items = router.getRoutes()
//     .filter(route => route.name !== 'Login' 
//             && route.name !== 'AddProductView' 
//             && route.name !== 'UpdateProductView');

const items = router.getRoutes()
    .filter(route => route.meta.isInNavbar === true);


function toggleActions(): void {
    areUserActionsDisplayed.value = !areUserActionsDisplayed.value;
}

function displayActions() {
    areUserActionsDisplayed.value = true;
}

function hideActions(e: Event) {
    setTimeout(() => {}, 1000);
    areUserActionsDisplayed.value = false;
}

function handleLogOut() {
    areUserActionsDisplayed.value = false;
    user.logOut();
}
</script>

<template>
<div class="navbar-container">
    <div class="logo-and-name">
        <Logo 
            :class="['logo']"
            :circular="true"
        ></Logo>
        <div class="firm-name">
            <span>Concrete</span>
            <span>Concept</span>
        </div>
    </div>
    <div class="nav-bar-wrapper">
        <nav class="nav-bar">
            <router-link class="item" v-for="item in items" :key="item.path" :to="item.path" active-class="current-item">
                {{item.name}}
            </router-link>
        </nav>
    </div>
    <div class="account-actions">
        <!-- TODO: use mouseenter and mouseleave events -->
        <button 
            class="material-symbols-outlined"
            @click="toggleActions"
        >account_circle
        </button>
        <Teleport
            to="#account-actions"
        >
            <AccountActions
                :display="areUserActionsDisplayed"
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
}
.logo-and-name {
    position: absolute;
    left: 0;
    display: flex;
    height: 100%;
}

.logo {
    height: 100%;
    width: 4vw;
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