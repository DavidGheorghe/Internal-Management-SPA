<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
    width: Number,
    height: Number,
    circular: {type: Boolean, default: false}
});
let imgPath = ref<string>();
if (props.circular) {
    imgPath.value = require("../../assets/logo-circular.png");
} else {
    imgPath.value = require("../../assets/logo.jpg");
}
</script>

<template>
<div class="logo-container">
    <img class="logo" :src="imgPath" alt="">
</div>
</template>

<style scoped>
.logo-container {
    height: auto;
    width: auto;
    max-width: 100%;
}
.logo {
    height: 100%;
    width: 100%;
}
</style>