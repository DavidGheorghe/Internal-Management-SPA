<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    modelValue: string
}>();
const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>();
const date = computed({
    get() {
        const dateMills = Date.parse(props.modelValue);
        return new Date(dateMills);
    },
    set(value) {
        const dateValue = value as Date;
        if (value) {
            const selectedDate = value.toLocaleDateString();
            emit('update:modelValue', selectedDate);
        }
    }
});
</script>

<template>
    <div class="datepicker-container">
        <input 
            type="date" 
            v-model="date">
    </div>
</template>

<style scoped lang="less">

</style>