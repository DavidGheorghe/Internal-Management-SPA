<script setup lang="ts">
import { ref, watch } from 'vue';

const searchedText = ref("");
const isFocused = ref(false);

const emits = defineEmits<{
    (e: 'searchText', searchedText: string): void;
}>();

function sendSearchedText() {
    /* Send text only if the text is not blank, or on clear action. */
    if (!isTextBlank() || searchedText.value === "") {
        emits('searchText', searchedText.value);
    }
}

/**
 * Regex to check if the text is blank.
 */
function isTextBlank() {
    return /^\s*$/.test(searchedText.value);
}

function clearText() {
    searchedText.value = "";
}

watch(searchedText, () => {
    sendSearchedText();
})
</script>

<template>
<div 
    class="search-bar-container" 
    :class="{'focused': isFocused}"
>
    <span class="material-symbols-outlined">search</span> 
    <input 
        class="input-search-bar"
        type="search" 
        v-model="searchedText"
        @focusin="isFocused=true"
        @focusout="isFocused=false"
        placeholder="Search..."
    >
    <span 
        class="material-symbols-outlined close"
        @click="clearText"
    >close</span>
</div>
</template>

<style lang="less" scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0");

.search-bar-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: rgba(182, 176, 176, 0.2);
    padding: 5px;
    border-radius: 10px;
    border: 1px solid transparent;
}

.search-bar-container.focused {
    border-width: 1px;
    border: 1px solid black;
    border-color: black;
}

.input-search-bar {
    all: unset;
    height: 100%;
    width: 100%;
}
.material-symbols-outlined {
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 48;
}

input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
  -webkit-appearance:none;
}

.close {
    cursor: pointer;
    font-size: 26px;
    color: #8d8d8d;
    &:hover {
        border-radius: 50%;
        background-color: rgba(182, 176, 176, 0.5);
        color: black;
    }
}
</style>