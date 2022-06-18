<script setup lang="ts">
import { ref, watch } from 'vue';

defineProps<{
    label?: string,
    placeholder?: string,
    required: boolean
}>();

const emits = defineEmits<{
    (e: 'sendValue', value: string): void
}>();

const value = ref("");

watch(value, () => {
    emits("sendValue", value.value);
})
</script>

<template>
<div class="input-string-container">
    <label for="input-string">{{label}}</label>
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
    // width: 250px;
    // height: 100%;
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
        border-bottom: 1px solid black;
    }
}

label {
    text-align: start;
    /* position: absolute; */
    /* left: 0; */
    width: 100%;
    /* color: #443e3e; */
    font-family: 'Segoe UI', serif;
    font-weight: 600;
}
</style>