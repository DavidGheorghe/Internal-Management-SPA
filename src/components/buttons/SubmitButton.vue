<script setup lang="ts">
withDefaults(defineProps<{
    label?: string,
    // disabled: boolean
}>(), {
    // disabled: false
});
// defineProps<{
//     label?: string,
//     enabled: Boolean
// }>();

defineEmits<{
    (e: 'submit'): void
}>();
</script>

<template>
    <button 
        class="submit-btn"
        type="submit"
        @click="$emit('submit')"
    >
        {{label}}
    </button>
</template>

<style lang="less" scoped>
.submit-btn {
    all: unset;
    width: 60px;
    height: 20px;
    padding: 10%;
    text-align: center;
    border: 1px solid transparent;
    cursor: pointer;
}
</style>