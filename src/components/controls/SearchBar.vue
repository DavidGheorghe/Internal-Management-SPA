<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps<{
    modelValue: string
}>();
const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()
const isFocused = ref(false);

function clearText() {
    searchedText.value = "";
    emit('update:modelValue', searchedText.value);
}

const searchedText = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value.trim());
    }
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