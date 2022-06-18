<script setup lang="ts">
defineProps<{
    label?: string
}>();
defineEmits<{
    (e: 'click'): void
}>();
</script>

<template>
    <button 
        type="button"
        class="add-button"
        @click="$emit('click')"
    >
        <span class="material-symbols-outlined">add</span>
        {{label}}
    </button>
</template>

<style lang="less" scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0");

.add-button {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0;
    padding: 2px 4px 2px 2px;
    font-size: 16px;
    height: 100%;
    cursor: pointer;
    border: 1px solid transparent;
    &:hover {
        // background-color: rgb(160, 154, 154);
        color: rgba(0, 0, 0, 0.9);
        border: 1px solid black;
    }
}

.material-symbols-outlined {
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 48;
  font-size: 24px;
  cursor: pointer;
}
</style>