<script setup lang="ts">
import { ref, watch } from 'vue';

defineProps<{
    label?: string,
    placeholder?: string,
    unitMeasure?: string,
    required: boolean
}>();

const emits = defineEmits<{
    (e: 'sendValue', value: number): void
}>();

const value = ref<number>();
watch(value, () => {
    if (value.value) {
        emits("sendValue", value.value);
    }
})
</script>

<template>
<div class="input-number-container">
    <label for="input-number">{{label}}</label>
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

</style>