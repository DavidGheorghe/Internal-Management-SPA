<script setup lang="ts">
import XButton from '@/components/buttons/XButton.vue';

defineProps<{
    display: boolean
}>();

defineEmits<{
    (e: 'hidden-modal'): void,
    (e: 'x-button-click'): void
}>();
</script>
<script lang="ts">
    export default {
        inheritAttrs: false
    }
</script>
<template>
    <Transition>
        <div 
            v-if="display"
            @keydown.esc="$emit('hidden-modal')"
            class="backdrop"
        >
            <div 
                class="content"
                v-bind="$attrs"
            >
                <div class="x-button-wrapper">
                    <XButton @click="$emit('x-button-click')"/>
                </div>
                <div class="title-wrapper">
                    <slot name="title"></slot>
                </div>
                <div class="text-wrapper">
                    <slot name="text"></slot>
                </div>
                <div class="cancel-button-wrapper">
                    <slot name="cancel-button"></slot>
                </div>
                <div class="ok-button-wrapper">
                    <slot name="ok-button"></slot>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.backdrop {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 99999;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.35);
}
.content {
    height: 40%;
    width: 40%;
    background-color: #efefef;
    position: relative;
    border-radius: 0.5rem;
}
.x-button-wrapper {
    position: absolute;
    top: 5px;
    right: 5px;
}
.title-wrapper {
    text-align: center;
    margin-top: 5%;
}
.text-wrapper {
    text-align: center;
    margin-top: 10%;
}
.cancel-button-wrapper {
    position: absolute;
    bottom: 5%;
    right: 17%;
    width: 74px;
}
.ok-button-wrapper {
    position: absolute;
    bottom: 5%;
    right: 5%;
    width: 74px;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>