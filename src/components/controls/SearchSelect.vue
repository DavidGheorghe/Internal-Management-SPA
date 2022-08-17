<script setup lang="ts">
import { SearchSelectOption } from '@/types/UtilsTypes';
import { computed } from '@vue/reactivity';
import { ref } from 'vue';

const props = defineProps<{
    options: SearchSelectOption[],
    label?: string,
    modelValue: string,
    required: boolean
}>();

const emits = defineEmits<{
    (e: 'send-option', selectedOption: SearchSelectOption): void,
    (e: 'update:modelValue', searchText: string): void
}>();

const finalLabel = computed(() => {
    if (props.required) {
        return props.label + "*";
    }
});

const searchedText = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emits('update:modelValue', value);
    }
});
const areOptionsDisplayed = ref(false);
const selectedOption = ref<SearchSelectOption>();
const availableOptions = computed(() => props.options.filter(option => option.value.includes(searchedText.value))) // TODO: improve if necessary


function displayOptions() {
    areOptionsDisplayed.value = true;
}

function hideOptions() {
    setTimeout(() => areOptionsDisplayed.value = false, 500);
}

function selectOption(option: SearchSelectOption) {
    searchedText.value = option.value.valueOf();
    selectedOption.value = option;
    emits("send-option", selectedOption.value);
}
</script>

<template>
<div class="search-select-container">
    <label for="search-select">{{finalLabel}}</label>
    <div class="input-container" :class="{'active' : areOptionsDisplayed}">
        <input 
            class="search-bar"
            id="search-select" 
            type="search" 
            autocomplete="off"
            v-model="searchedText" 
            placeholder="Search"
            :required="required"
            @focusin="displayOptions"
            @focusout="hideOptions" 
        >
        <!-- <span class="material-symbols-outlined" @click="displayOptions">expand_more</span> -->
        <div  
            v-if="areOptionsDisplayed"
            class="options"
        >
            <div
                v-if="availableOptions.length > 0"
                id="option"
                v-for="option in availableOptions" 
                :key="option.id.valueOf()"
                @click="selectOption(option)"
            >
                {{option.value}}
            </div>
            <div
                v-else
                class="empty-options">
                <span>No Results.</span>
            </div>
        </div>
    </div>
    
</div>
</template>

<style lang="less" scoped>
@import "@/assets/colors.less";

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
    padding: 5px;
    &:hover {
        background-color: #efefef;
    }
}
.options {
    border: 1px solid #aba6a6;
    border-top: 0;
    position: absolute;
    width: 100%;
    max-height: 10rem;
    box-sizing: border-box;
    left: 0;
    overflow: auto;
    z-index: 99999;
    background-color: white;
}
.empty-options {
    height: 75px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    & span {
        color: grey;
        font-size: 1.8rem;
    }
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
    border: 1px solid #aba6a6;
    margin-top: 5px;
    .active {
        border-color: @custom-blue;
    }
}
.search-bar {
    width: 100%;
    height: 100%;
    text-overflow: ellipsis;
    padding-left: 0.1rem;
    &:focus {
        border-color: black;
    }
}
#search-select::-webkit-search-cancel-button {
    position: relative;
    margin-right: 20px;
}
.material-symbols-outlined {
    position: absolute;
    right: 0;
    // z-index: -1;
    display: inline;
    cursor: pointer;
    height: 100%;
}
</style>