<script setup lang="ts">
import { ref } from 'vue';

const searchedText = ref("");

const emits = defineEmits<{
    (e: 'searchText', searchedText: string): void;
}>();

function sendSearchedText() {
    emits('searchText', searchedText.value);
}
</script>

<template>
<!-- <div class="search-bar"> -->
    <input type="search" v-model="searchedText" @input="sendSearchedText">
<!-- </div> -->
</template>

<style scoped>
/* .search-bar {
    width: 100%;
    height: 100%;
} */
</style>