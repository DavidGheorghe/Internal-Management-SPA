<script setup lang="ts">

defineProps<{
    label?: string
}>();

defineEmits<{
    (e: 'click'): void
}>();
</script>

<template>
    <button type="button" @click="$emit('click')">
        {{label}}
    </button>
</template>

<style lang="less" scoped>
button {
    all: unset;
    box-sizing: border-box;
    width: 60px;
    text-align: center;
    border: 1px solid black;
    border-radius: 0.2rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-weight: 500;
    &:hover {
        box-shadow: inset .01rem .01rem 0rem .05rem black;
        cursor: pointer;
    }
    &:disabled {
        border-color: transparent;
        box-shadow: none;
        color: white;
        opacity: 0.5;
    }
}
</style>