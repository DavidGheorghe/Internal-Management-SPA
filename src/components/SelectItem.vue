<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    options: string[],
    defaultOption?: string
}>();
let selectedOption = ref<string | undefined>();
if (props.defaultOption !== undefined) {
    selectedOption.value = props.defaultOption;
} else {
    selectedOption.value = props.options[0];
}

const emits = defineEmits<{
    (e: 'updateValue', value: string): void
}>();

function sendNewValue(newValue: string | undefined) {
    if (newValue !== undefined) {
        emits('updateValue', newValue);
    }
}
</script>

<template>
<select @change="sendNewValue(selectedOption)" v-model="selectedOption">
    <option v-for="option in options" :value="option">{{option}}</option>
</select>
</template>

<style>
</style>
