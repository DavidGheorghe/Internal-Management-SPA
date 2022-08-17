<script lang="ts">
    export default {
        inheritAttrs: false
    }
</script>

<script setup lang="ts">
import { computed } from '@vue/reactivity';

const props = defineProps<{
    modelValue: string,
    placeholder?: string,
    resizeable?: boolean
    label?: string,
    required: Boolean,
    cols: number,
    rows: number,
}>()
const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>();

const resizeRuleValue = computed(() => props.resizeable ? 'both' : 'none');

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
    <!-- <div class="textarea-container"> -->
        <label for="custom-textarea-input">{{label}}</label>
        <textarea 
            v-bind="$attrs"
            :class="$attrs['class']"
            name="details"
            id="custom-textarea-input"
            class="custom-textarea" 
            :cols="cols" 
            :rows="rows"
            :placeholder="placeholder"
            v-model="inputText"
        ></textarea>
    <!-- </div> -->
</template>

<style scoped lang="less">
@import "@/assets/colors.less";

.custom-textarea {
    resize: v-bind(resizeRuleValue);
    &:focus {   
        outline: none;
        border: 1px solid @custom-blue;
    }
}
</style>