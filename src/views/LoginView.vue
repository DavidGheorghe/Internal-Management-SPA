<script setup lang="ts">
import LoginForm from "@/components/forms/LoginForm.vue";
</script>

<template>
<div class="background">
    <h1 class="app-name">
        Internal Order Life Cycle and <br> Management System
    </h1>
    <LoginForm></LoginForm>
</div>
</template>

<style scoped>
.background {
    width: 100%;
    height: 100% !important;
    background-color: #efefef;
    margin-top: 0 !important;
    position: fixed;
}

.app-name {
    position: relative;
    top: 5vh;
    text-align: center;
    font-family: "Rockwell", "Courier Bold", Courier;
}
</style>
