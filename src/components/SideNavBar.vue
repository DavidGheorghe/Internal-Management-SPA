<script setup lang="ts">
import router from '@/router';
import { useUserStore } from '@/stores/UserStore';
import Logo from './Logo.vue';

const user = useUserStore();
const items = router.getRoutes()
    .filter(route => route.name !== 'Login' 
            && route.name !== 'AddProductView' 
            && route.name !== 'UpdateProductView')
</script>

<template>
<div class="navbar-container">
    <Logo 
        :class="['logo']"
        :circular="true"
    ></Logo>
    <nav class="nav-bar">
        <div class="item" v-for="item in items" :key="item.path">
            <router-link :to="item.path" active-class="current-item">
                {{item.name}}
            </router-link>
        </div>
        <div class="logout-item" @click="user.logOut()">
            Log Out
        </div>
    </nav>
</div>
</template>

<style scoped>
.navbar-container {
    position: fixed;
    background-color: rgb(182, 179, 179);
    top: 0;
    left: 0;
    height: 100%;
    width: 5vw;
}
.logo {
    width: 100%;
    height: 5vw;
}
.nav-bar {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.item {
    color: black;
    width: 100%;
    height: 100%;
    text-align: center;
    padding-left: 0;
    margin: 0;
}

.item:hover {
    cursor: pointer;
    background-color: rgb(114, 114, 116);
    color: white;
}
a {
    position: relative;
    display: inline-block;
    height: 100%;
    width: 100%;
    text-decoration: none;
    font-size: 1vw;
    padding-top: 16px;    
    padding-bottom: 16px;
}
.current-item {
    background-color: rgb(114, 114, 116);
    color: white !important;
}
a:visited {
    color: inherit;
}

.item:active {
    color: black;
}

.active-item {
    background-color: rgb(114, 114, 116);
    color: white;
}

.logout-item {
    position: absolute;
    bottom: 0;
    cursor: pointer;
    width: 100%;
    height: auto;
    text-align: center;
    color: white;
    padding: 15px 0 15px 0;
    background-color: rgb(114, 114, 116);
    font-size: 1vw;
}
</style>