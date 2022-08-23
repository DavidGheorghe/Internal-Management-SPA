<script setup lang="ts">
import { useUserStore } from '@/stores/UserStore';
import { ref } from 'vue';
import LoadingSpinner from '@/components/visual/LoadingSpinner.vue';
import Logo from '@/components/visual/Logo.vue';
import InputString from '@/components/controls/InputString.vue';
import SubmitButton from '../buttons/SubmitButton.vue';

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
            <span 
                v-show="failedAuthentication"
                class="wrong-credentials-notification" 
            >
                Wrong username or password!
            </span>
                <InputString 
                    class="username-input"
                    type="text"
                    v-model="username"
                    placeholder="Username"
                    :required="username === '' || username === undefined"
                />
                <InputString 
                    class="password-input"
                    type="password"
                    v-model="password"
                    placeholder="Password"
                    :required="password === ''  || password === undefined"
                />
            <LoadingSpinner
                class="spinner"
                :active="loading"
                text="Loading..."
            />
            <SubmitButton 
                class="login-button"
                label="Log In"
                :is-disabled="loading"
                @click="login"
            />
        </form>
    </div>
</template>

<style scoped lang="less">
@import "@/assets/colors.less";

.container {
    position: relative;
    border: 1px solid black;
    border-radius: 0.2rem;
    width: 20rem;
    height: 25rem;
    display: grid;
    grid-template-rows: 6rem auto;
    justify-items: center;
    box-shadow: .01rem .01rem .3rem black;
}

.logo {
    padding-top: 5px;
    text-align: center;
    height: 5vw;
    width: 5vw;
    align-self: center;
}

form {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 20% 20% 20% 25% 15%;
    align-items: center;
    justify-items: center;
    .wrong-credentials-notification {
        grid-row: 1 / 2;
    }
    .username-input {
        grid-row: 2 / 3;
    }
    .password-input {
        grid-row: 3 / 4;
    }
    .spinner {
        grid-row: 4 / 5;
    }
    .login-button {
        grid-row: 5 / 6;
        width: 6rem;
        height: 1.5rem;
        font-size: 1rem;
        font-weight: 500;
        border: 1px solid black;
        border-radius: 0.3rem;
        &:hover {
            box-shadow: inset .01rem .01rem 0rem .05rem black;
        }
        background-color: @custom-green;
        &:disabled {
            border-color: transparent;
            box-shadow: none;
            color: white;
            opacity: 0.5;
        }
    }
}
.spinner {
    position: relative;
    margin-bottom: 5px;
}
.wrong-credentials-notification {
    padding: 2px;
    font-size: 1.8vh;
    background-color: #ff000045;
    border-radius: 5px;
    border: 1px solid #ff00005c;
    color: #6a0303;
}
</style>
