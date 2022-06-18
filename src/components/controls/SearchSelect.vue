<script setup lang="ts">
import { SearchSelectOption } from '@/Types/GenericArrayType';
import { computed } from '@vue/reactivity';
import { ref, watch } from 'vue';

const props = defineProps<{
    options: SearchSelectOption[],
    label?: string
}>();

const emits = defineEmits<{
    (e: 'send-option', selectedOption: SearchSelectOption): void
}>();

const searchedText = ref("");
const showOptions = ref(false);
const selectedOption = ref<SearchSelectOption>();
// const placeholder = ref("Search");
const availableOptions = computed(() => props.options.filter(option => option.value.includes(searchedText.value))) // TODO: improve if necessary


function displayOptions() {
    showOptions.value = true;
}

function hideOptions() {
    setTimeout(() => showOptions.value = false, 500);
}

function selectOption(option: SearchSelectOption) {
    searchedText.value = option.value.valueOf();
    selectedOption.value = option;
    emits("send-option", selectedOption.value);
}
</script>

<template>
<div class="search-select-container">
    <label for="search-select">{{label}}</label>
    <div class="input-container">
        <input 
            class="search-bar"
            id="search-select" 
            type="search" 
            v-model="searchedText" 
            placeholder="Search"
            @focusin="displayOptions"
        >
        <span class="material-symbols-outlined">expand_more</span>
    </div>
    <div  
        class="options"
        v-show="showOptions"
    >
        <div 
        id="option"
        v-for="option in availableOptions" 
        :key="option.id.valueOf()"
        @click="selectOption(option)"
        >
            {{option.value}}
        </div>
    </div>
</div>


</template>

<style scoped>

input, label {
    all: unset;
}

.search-select-container {
    padding: 5px 45px 5px 45px;
    height: 50px;
    display: flex;
    flex-direction: column;    
    justify-content: center;
    align-items: center;
    position: relative;
}

#option {
    cursor: pointer;
}



.options {
    border: 1px solid black;
    position: absolute;
    margin-bottom: -55px;
}

label {
    width: 100%;
    text-align: start;
    font-family: 'Segoe UI', serif;
    font-weight: 600;
}

.input-container {
    height: 50%;
    width: 100%;
    position: relative;
    /* box-sizing: border-box; */
    border: 1px solid black;
    margin-top: 5px;
}

.search-bar {
    /* width: calc(100% - 24px); */
    width: 100%;
    height: 100%;
}

#search-select::-webkit-search-cancel-button {
    /* -webkit-appearance: none; */
    position: relative;
    margin-right: 20px;
}

.material-symbols-outlined {
    position: absolute;
    right: 0;
    z-index: -1;
    display: inline;
    cursor: pointer;
}
</style>