<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { ref, watch } from 'vue';

const props = defineProps<{
    modelValue: number,
    label?: string,
    placeholder?: string,
    unitMeasure?: string,
    required: boolean
}>();

const emits = defineEmits<{
    (e: 'update:modelValue', value: number): void
}>();
const labelAndUM = computed(() => {
    let finalLabel = "";
    if (props.label && props.unitMeasure) {
        finalLabel = `${props.label} (${props.unitMeasure})`
    } else if (props.label) {
        finalLabel = `${props.label}`
    }
    return finalLabel;
});

const value = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emits('update:modelValue', value);
    }
});

// watch(value, () => {
//     if (value.value) {
//         emits("sendValue", value.value);
//     }
// })
</script>

<template>
<div class="input-number-container">
    <label for="input-number">{{labelAndUM}}</label>
    <input 
        type="number"
        id="input-number"
        :required="required"
        :placeholder="placeholder"
        v-model="value"
    >
</div>
</template>

<style lang="less" scoped>
label, input {
    all: unset;
}

.input-number-container {
    height: 50px;
    // width: 75px;
    // max-width: 150px;
    width: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
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