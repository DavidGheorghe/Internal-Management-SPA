<script setup lang="ts">

const props = defineProps<{
    label?: string
}>();

const emits = defineEmits<{
    (e: 'click'): void
}>();

function sendClickEvent() {

}
</script>

<template>
<button
    class="back-btn"
    type="button"
    @click="$emit('click')"
>
    <span class="material-symbols-outlined">arrow_back_ios_new</span>
    {{label}}
</button>
</template>

<style lang="less" scoped>
@import "@/assets/colors.less";
.back-btn {
    all: unset;    
    background-color: @custom-green;
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 18px;
    color: #efefef;
    border: 1px solid transparent;
    &:hover {
        border: 1px solid black;
        color: black;
    }
}

.material-symbols-outlined {
    font-size: 20px;
}
</style>