<script setup lang="ts">
import SideNavBar from '@/components/SideNavBar.vue';
</script>

<template>
<SideNavBar v-show="$route.path !== '/login'">
</SideNavBar>
<Suspense> 
	<router-view :style="{'margin-left': 5 + 'vw'}"></router-view> 
</Suspense>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: stretch;
  align-items: stretch;
}
#app {
  font-family: Helvetica, sans-serif;
  height: inherit;
  width: inherit;
}
</style>
