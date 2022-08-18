<script setup lang="ts">
import { ElLoading } from 'element-plus';
import { nextTick } from 'vue';

const loadingInstance = ElLoading.service({
    fullscreen: true
});
nextTick(() => {
  loadingInstance.close()
})
</script>

<template>
</template>

<style scoped lang="less">
.loading-view-container {
    height: 100%;
    width: 100%;
    // display: flex;
    // align-items: center;
    // justify-content: center;
}
</style>