<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
    width: Number,
    height: Number,
});
let imgPath = ref<string>();
imgPath.value = require("../../assets/logo.jpg");
</script>

<template>
    <img class="logo" :src="imgPath" alt="">
</template>

<style scoped>
.logo-container {
    height: auto;
    width: auto;
    max-width: 100%;
}
.logo {
    /* height: 100%;
    width: 100%; */
    object-fit: cover;
}
</style>