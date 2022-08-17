<script setup lang="ts">
withDefaults(defineProps<{
    label?: string,
    isDisabled: boolean
}>(), {
    isDisabled: false
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
        :disabled="isDisabled"
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
    // padding: 2px 4px 2px 2px;// 10%;
    text-align: center;
    border: 1px solid transparent;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-weight: 500;
    cursor: pointer;
    &:disabled {
        cursor: default;
        border-color: transparent;
        box-shadow: none;
        color: white;
        opacity: 0.5;
    }
    &:hover {
        box-shadow: inset .01rem .01rem 0rem .05rem black;
        cursor: pointer;
    }
}
</style>