<script setup lang="ts">
import { computed } from '@vue/reactivity';

const props = defineProps<{
    modelValue: string,
    options: string[],
    required: boolean,
    isDisplayedAsColumn: boolean
}>();

const emits = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>();

const cssFlexboxDirectionValue = computed(() => props.isDisplayedAsColumn ? 'column' : 'row');

const value = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        if (value) {
            emits('update:modelValue', value);
        }
    }
});

</script>

<template>
<div class="radio-group-container">
    <div 
        class="option-wrapper"
        v-for="option in options"
        :key="option"
    >
        <input 
            type="radio" 
            :id="option"
            name="radio-group"
            v-model="value"
            :value="option"
            :required="required"
        > 
        <label :for="option">{{option}}</label>
    </div>
</div>
</template>

<style lang="less" scoped>
.radio-group-container {
    display: flex;
    flex-direction: v-bind(cssFlexboxDirectionValue);
}
</style>