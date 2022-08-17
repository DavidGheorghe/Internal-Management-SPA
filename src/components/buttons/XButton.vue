<script setup lang="ts">

defineEmits<{
    (e: 'click'): void
}>();
</script>

<template>
    <button 
        class="x-button"
        type="button"
        @click="$emit('click')"
    >
        <span class="material-symbols-outlined">close</span>
    </button>
</template>

<style lang="less" scoped>
button {
    all:unset;
}
.x-button {
    width: 24px;
    height: 24px;
    text-align: center; 
    cursor: pointer;
}

.material-symbols-outlined {
    font-size: 24px;
    &:hover {
        font-weight: 600;
    }
}
</style>