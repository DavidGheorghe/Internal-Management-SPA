<script setup lang="ts">
import { useIsCurrentUserSupervisor } from '@/composables/rolesComposables';

const props = defineProps<{
    isPinned: boolean,
    isDisabled?: boolean
}>();

const emit = defineEmits<{
    (e: 'pin-order'): void,
    (e: 'unpin-order'): void,
}>();

const isCurrentUserSupervisor = useIsCurrentUserSupervisor();

function togglePinnedOrder() {
    if (props.isPinned) {
        emit('unpin-order');
    } else {
        emit('pin-order');
    }
}
</script>

<template>
    <button 
        type="button"
        class="pin-button"
        :class="{'pinned': isPinned && isCurrentUserSupervisor}"
        :disabled="isDisabled"
        @click="togglePinnedOrder"
    >
        <span class="material-symbols-outlined">push_pin</span>
    </button>
</template>

<style lang="less" scoped>
.pinned {
    color: yellow;
}
.pin-button {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: inherit;
    border: none;
    cursor: pointer;
    &:disabled {
        cursor: default;
        opacity: 0.6;
    }
}
</style>
