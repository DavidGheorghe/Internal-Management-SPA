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
        <label v-if="label">{{finalLabel}}</label>
        <input 
            :type="type"
            :required="required"
            :placeholder="placeholder"
            v-model="value"
        >
    </div>
</template>

<style lang="less" scoped>
@import "@/assets/colors.less";
.input-string-container {
    height: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
}

label, input {
    all: unset;
}

input {
    border-top: 1px solid transparent;
    border-bottom: 1px solid #aba6a6;
    width: 100%;
    height: 50%;
    &:focus {
        border-top: none;
        border-bottom: 2px solid @custom-blue;
    }
}

label {
    text-align: start;
    width: 100%;
    font-family: 'Segoe UI', serif;
    font-weight: 600;
}
</style>