<script setup lang="ts">
import { ref } from 'vue';
// defineProps<{
//     display: boolean
// }>();
defineExpose({
    displayNotification,
    hideNotification
});

const display = ref(false);

function displayNotification() {
    display.value = true;
}
function hideNotification() {
    display.value = false;
}
</script>

<template>
    <Transition name="slide-fade">
        <div 
            class="notification-container"
            v-if="display"
        >
            <slot name="title"></slot>
            <slot name="text"></slot>
        </div>
    </Transition>        
</template>

<style lang="less" scoped>
.slide-fade-enter-active {
  transition: all 3s ease-out;
}
.slide-fade-leave-active {
  transition: all 1.5s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
.notification-container {
    width: 100%;
    background-color: black;
}
</style>
