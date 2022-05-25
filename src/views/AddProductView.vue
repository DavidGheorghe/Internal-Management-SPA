<script setup lang="ts">
import AddOrUpdateProductForm from '@/components/AddOrUpdateProductForm.vue';
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();

const pageTitle =  "Add Product";
</script>

<template>
<div class="background">
    <h3>{{pageTitle}}</h3>
    <button @click="router.back">Go back</button>
    <AddOrUpdateProductForm></AddOrUpdateProductForm>
</div>
</template>

<style scoped>
.background {
    margin-left: 5vw;
}
</style>