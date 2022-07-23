<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    options: string[],
    defaultOption?: string
}>();

const selectedOption = ref(props.defaultOption ?? props.options[0]);
const emits = defineEmits<{
    (e: 'updateValue', value: string): void
}>();

function sendNewValue(newValue: string) {
    emits('updateValue', newValue);
}
</script>

<template>
    <div class="select-item-container">
        <select 
            @change="sendNewValue(selectedOption)"
            v-model="selectedOption"
        >
            <option 
                :value="defaultOption" 
                :selected="true" 
                :disabled="true" 
                :hidden="true"
            >{{defaultOption}}</option>
            <option 
                v-for="option in options" 
                :value="option"
                @click="sendNewValue(option)"
            >{{option}}</option>
        </select>
        <!-- <span class="material-symbols-outlined expand-arrow">expand_more</span> -->
    </div>
</template>

<style lang="less" scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0");

.select-item-container {
    display: flex;
    position: relative;
    // border: 1px solid black;
    border-radius: 5px;
    cursor: pointer;
    background-color: rgba(182, 176, 176, 0.2);
}
.select-item-container:focus {
    border: 1px solid black;
}
.select-item {
    all: unset;
    /* border: 1px solid black;
    border-radius: 5px; */
    display: inline-block;
    text-align: left;
    padding: 4px 2px 2px 4px;
    position: relative;
}
.select-item:active {
    cursor: default;
}
.material-symbols-outlined {
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 48;
  position: absolute;
  right: 0;
  top: 0;
  z-index: -1;
  font-size: 26px;
}
option {
    // all: unset;
    &:hover {
        cursor: pointer;
        background-color: rgba(182, 176, 176, 0.2);;
    }
}
.option {
   
    
    &:hover {
        cursor: pointer;
        background-color: rgba(182, 176, 176, 0.2);;
    }
    
}
</style>
