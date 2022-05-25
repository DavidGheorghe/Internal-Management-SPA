<script setup lang="ts">
import { useUserStore } from '@/stores/UserStore'
import { ref } from 'vue';
import LoadingSpinner from './LoadingSpinner.vue';
import Logo from './Logo.vue';

let username = ref<string>("");
let password = ref<string>("");

const userStore = useUserStore();

let failedAuthentication = ref(false);
let loading = ref(false);

async function login() {
    if (username.value !== "" && password.value !== "") {
        failedAuthentication.value = false;
        if (!failedAuthentication.value) {
            loading.value = true;
        } else {
            loading.value = false;
        }
        await userStore.logIn(username.value, password.value)
            .catch(() => {
                failedAuthentication.value = true;
                loading.value = false;
                password.value = "";
            });
    }
}
</script>

<template>
    <div class="container">
        <Logo
            :class="['logo']"
            :circular="true"
        ></Logo>
        <form @submit.prevent> 
            <span class="wrong-credentials-notification" v-show="failedAuthentication">Wrong username or password!</span>
            <div class="form-fields">
                <!-- <label for="username">Username</label> -->
                <input type="text" name="username" v-model="username" placeholder="Username" :required="username === '' || username === undefined" />

                <!-- <label for="password">Password</label> -->
                <input type="password" name="password" v-model="password" placeholder="Password" :required="password === ''  || password === undefined" />
            </div>
            <LoadingSpinner
                class="spinner"
                :active="loading"
                text="Loading..."></LoadingSpinner>
            <button class="submit-btn" type="submit" name="submit button" :disabled="loading" @click="login">Log In</button>
        </form>
    </div>
</template>

<style scoped>
.container {
    position: fixed;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background-color: white;
    height: 400px;
    max-height: 400px;
    width: 350px;
    max-width: 350px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
}

.logo {
    padding-top: 5px;
    text-align: center;
    height: 5vw;
    width: 5vw;
    align-self: center;
}

form {
    height: 100%;
    width: 100%;
    display: flex;
    padding-top: 35px;
    align-items: center;
    flex-direction: column;
}

.form-fields {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
    margin-top: 15px
    
}
.form-fields > * {
    padding: 5px;
}

.submit-btn {
    position: fixed;
    bottom: 20px;
    cursor: pointer;
    background-color: rgb(182, 179, 179);
    color: rgb(0, 0, 0);
    height: 30px;
    width: 65px;
    border-radius: 5px;
    border-color: rgb(114, 114, 116);
    border-style: ridge;
}
.submit-btn:hover {
    background-color: rgb(114, 114, 116);
}

input {
    padding: 5px;
    margin: 10px;
}
.spinner {
    position: relative;
    margin-bottom: 5px;
}
.wrong-credentials-notification {
    position: fixed;
    padding: 2px;
    color: rgb(63, 50, 50);
    font-size: 1.8vh;
}
</style>
