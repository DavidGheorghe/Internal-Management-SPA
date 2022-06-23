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
    // background-color: #60a5fa;// rgb(185, 184, 184);
    // color: white;
    width: 60px;
    height: 20px;
    padding: 10%;
    text-align: center;
    border: 1px solid transparent;
    cursor: pointer;
    // &:hover {
    //     border: 1px solid black;
    //     color: black;
    // }
}
</style>