<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
    firstOption: string,
    secondOption: string,
    defaultOptionIndex: 0 | 1
}>();

const emits = defineEmits<{
    (e: 'sendOption', option: string): void
}>();

const isFirstOptionActive = ref(props.defaultOptionIndex === 0 ? true : false);
const isSecondOptionActive = ref(!isFirstOptionActive.value);
const activeOption = computed(() => isFirstOptionActive.value ? props.firstOption : props.secondOption);

function toggleAndSendOption(option: string) {
    if (option !== activeOption.value) {
        toggleOptionsFlags();
        sendOption(option);
    }
}

function sendOption(option: string) {
    if (isFirstOptionActive.value === false) {
        option = props.firstOption;
        emits('sendOption', option);
    } else {
        option = props.secondOption;
        emits('sendOption', option);
    }
}

function toggleOptionsFlags() {
    isFirstOptionActive.value = !isFirstOptionActive.value;
    isSecondOptionActive.value = !isSecondOptionActive.value;
}
</script>

<template>
<div class="switch-button-container">
    <div 
        class="option"
        :class="{'active': isFirstOptionActive}"
        @click="toggleAndSendOption(firstOption)"
    >{{firstOption}}</div>
    <div 
        class="option"
        :class="{'active': isSecondOptionActive}"
        @click="toggleAndSendOption(secondOption)"
    >{{secondOption}}</div>
</div>
</template>

<style lang="less" scoped>
.switch-button-container {
    box-sizing: border-box;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    // border-radius: 5px;
}
.option {
    background-color: rgb(247, 242, 242);
    height: 100%;
    position: relative;
    padding: 0 5px 0 5px;
    text-align: center;
    line-height: 30px;
    font-weight: 550;
    color: rgba(0, 0, 0, 0.2);
    border: 1px solid transparent;
    cursor: pointer;
    &:hover {
        border: 1px solid rgba(0, 0, 0, 0.2);
    }
}

.option:last-child {
    border-right: 0;
}

.option.active {
    background-color: #22c55e;//#77b994;
    color: white;
    border: 1px solid black;
    cursor: default;
}
</style>
