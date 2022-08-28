<script setup lang="ts">
import LoginForm from "@/components/forms/LoginForm.vue";
import { ref } from "vue";

let imgPath = ref<string>();
imgPath.value = require("../assets/login-background.jpg");
</script>

<template>
    <div class="background">
        <section>
            <img 
                class="background-image"
                :src="imgPath"
            />
        </section>
        <section class="login-section">
            <h1 class="app-name">
                Internal Order Tracking and <br> Management System
            </h1>
            <!-- <Suspense> -->
                <LoginForm/>
            <!-- </Suspense> -->
        </section>
    </div>
</template>

<style scoped>
.background {
    width: 100%;
    height: 100% !important;
    margin-top: 0 !important;
    position: fixed;
    display: grid;
    grid-template-columns: 2fr 1fr;
}
.background-image {
    width: 100%;
    height: 100%;
}
.login-section {
    display: grid;
    grid-template-rows: 25% 75%;
    justify-items: center;
}
.app-name {
    text-align: center;
    font-family: "Rockwell", "Courier Bold", Courier;
}
</style>
