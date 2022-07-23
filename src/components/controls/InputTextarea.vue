<script setup lang="ts">
import { computed } from '@vue/reactivity';

const props = defineProps<{
    modelValue: string,
    label?: string,
    required: Boolean,
    cols: number,
    rows: number,
}>()
const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>();
const inputText = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        if (value) {
            const trimmedValue = value.trim();
            emit('update:modelValue', trimmedValue);
        }
    }
})
</script>

<template>
    <div class="textarea-container">
        <label 
            for="custom-textarea-input">{{label}}</label>
            <textarea 
                name="details"
                id="custom-textarea-input" 
                :cols="cols" 
                :rows="rows"
                v-model="inputText"
            ></textarea>
    </div>
</template>

<style scoped lang="less">

</style>