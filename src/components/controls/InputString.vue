<script setup lang="ts">
import { computed } from '@vue/reactivity';

// const props = defineProps<{
//     modelValue: string,
//     label?: string,
//     placeholder?: string,
//     required: boolean
// }>();
const props = withDefaults(defineProps<{
    modelValue: string,
    label?: string,
    placeholder?: string,
    required?: boolean
    type?: 'email' | 'password' | 'text' | 'search'
}>(), {
    required: false,
    type: 'text'
});
const emits = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>();

const finalLabel = computed(() => {
    let finalLabel = props.label;
    if (props.required) {
        finalLabel += '*';
    }
    return finalLabel;
})

const value = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emits('update:modelValue', value);
    }
});
</script>

<template>
    <div class="input-string-container">
        <label for="input-string">{{finalLabel}}</label>
        <input 
            type="text"
            id="input-string"
            :required="required"
            :placeholder="placeholder"
            v-model="value"
        >
    </div>
</template>

<style lang="less" scoped>

.input-string-container {
    height: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
}

label, input {
    all: unset;
}

input {
    border-bottom: 1px solid #aba6a6;
    width: 100%;
    height: 50%;
    &:focus {
        border-bottom: 1px solid #22c55e;
    }
}

label {
    text-align: start;
    width: 100%;
    font-family: 'Segoe UI', serif;
    font-weight: 600;
}
</style>