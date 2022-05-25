<template>
<div class="background">
    <LoginForm></LoginForm>
</div>
</template>

<script setup lang="ts">
import LoginForm from "@/components/LoginForm.vue";
</script>

<style scoped>
.background {
    width: 100%;
    height: 100%;
    background-color: rgb(182, 179, 179);
    /* padding-left: -5vw; */
    margin-left: 0 !important;
}
</style>
