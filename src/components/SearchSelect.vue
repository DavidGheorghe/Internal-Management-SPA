<script setup lang="ts">
import { SearchSelectOption } from '@/Types/GenericArrayType';
import { computed } from '@vue/reactivity';
import { ref, watch } from 'vue';

const props = defineProps<{
    options: SearchSelectOption[]
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
    <input 
        class="search-bar" 
        type="search" 
        v-model="searchedText" 
        placeholder="Search" 
        @focusin="displayOptions"
        @focusout="hideOptions"
    >   
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
.search-select-container {
    width: 50px;
    text-align: center;    
}

#option {
    cursor: pointer;
}
</style>