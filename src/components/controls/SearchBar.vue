<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps<{
    modelValue: string,
    placeholder?: string
}>();
const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

const searchedText = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value);
    }
})
</script>

<template>
    <el-input
        v-model="searchedText"
        :placeholder="placeholder"
        clearable    
    />
</template>
