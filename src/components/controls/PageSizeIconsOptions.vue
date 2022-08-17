<script setup lang="ts">
import { SizeType } from '@/utils/Utils';
import { ref } from 'vue';

const isSmallActive = ref(true);
const isMediumActive = ref(false);
const isLargeActive = ref(false);

const emits = defineEmits<{
    (e: 'selectedOption', value: SizeType): void
}>();

function selectSmall() {
    activateSmallDeactiveOthers();
    emits('selectedOption', SizeType.SMALL);
}

function selectMedium() {
    activateMediumDeactiveOthers();
    emits('selectedOption', SizeType.MEDIUM);    
}

function selectLarge() {
    activateLargeDeactiveOthers();
    emits('selectedOption', SizeType.LARGE);
}

function activateSmallDeactiveOthers() {
    isSmallActive.value = true;
    deactivateMedium();
    deactivateLarge();
}

function activateMediumDeactiveOthers() {
    isMediumActive.value = true;
    deactivateSmall();
    deactivateLarge();
}

function activateLargeDeactiveOthers() {
    isLargeActive.value = true;
    deactivateSmall();
    deactivateMedium();
}

function deactivateSmall() {
    isSmallActive.value = false;
}
function deactivateMedium() {
    isMediumActive.value = false;
}
function deactivateLarge() {
    isLargeActive.value = false;
}

</script>

<template>
<div class="density-options-container">
    <el-tooltip
        class="box-item"
        effect="dark"
        content="15 items"
        placement="top"
    >
        <span 
            class="material-symbols-outlined" 
            :class="{'activated': isSmallActive}"
            @click="selectSmall"
        >
            density_small
        </span>
    </el-tooltip>
    <el-tooltip
        class="box-item"
        effect="dark"
        content="10 items"
        placement="top"
    >
        <span 
            class="material-symbols-outlined"
            :class="{'activated': isMediumActive}"
            @click="selectMedium"
        >
            density_medium
        </span>
    </el-tooltip>
    <el-tooltip
        class="box-item"
        effect="dark"
        content="5 items"
        placement="top"
    >
        <span 
            class="material-symbols-outlined" 
            :class="{'activated': isLargeActive}"
            @click="selectLarge"
        >
            density_large
        </span>
    </el-tooltip>
</div>
</template>

<style lang="less" scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0");

.density-options-container {
    display: flex;
    height: 100%;
}
.material-symbols-outlined {
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 48;
}
.material-symbols-outlined:hover {
    cursor: pointer;
    background-color: rgba(182, 176, 176, 0.2);
}
.material-symbols-outlined.activated {
    background-color: rgba(182, 176, 176, 0.2);
}
.box-item {
    font-family: inherit;
}
</style>