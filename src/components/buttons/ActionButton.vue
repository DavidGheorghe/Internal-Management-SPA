<script setup lang="ts">
defineProps<{
    label?: string,
    actionType: 'add' | 'delete' | 'edit' | 'close' | 'done',
    disabled?: boolean
}>();
defineEmits<{
    (e: 'click'): void
}>();
</script>

<template>
    <button 
        type="button"
        class="action-button"
        :disabled="disabled"
        @click="$emit('click')"
    >
        <span class="material-symbols-outlined">{{actionType}}</span>
        {{label}}
    </button>
</template>

<style lang="less" scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0");

.action-button {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2px 4px 2px 2px;
    font-size: 1.05rem;
    font-weight: 500;
    // font-family: 'Open Sans', sans-serif;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    height: 100%;
    border: 1px solid black;
    border-radius: 0.2rem;
    &:hover {
        box-shadow: inset .01rem .01rem 0rem .05rem black;
        color: rgba(0, 0, 0, 0.9);
        cursor: pointer;
    }
    &:disabled {
        border: inherit;
        box-shadow: none;
        color: inherit;
        cursor: not-allowed !important;
        opacity: 0.6;
    }
}

.material-symbols-outlined {
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 48;
  font-size: 24px;
}

</style>