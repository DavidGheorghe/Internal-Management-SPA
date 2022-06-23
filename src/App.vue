<script setup lang="ts">
import TopNavBar from '@/components/menu/TopNavBar.vue';

const styles = {
	'margin-top': '7vh',
	'height': 'calc(100% - 7vh)'
}
</script>

<template>
<TopNavBar v-show="$route.path !== '/login'">
</TopNavBar>
<div class="account-actions-container">
  
</div>
<Suspense> 
	<router-view :style="styles"></router-view>
</Suspense>
</template>

<style>
/* @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"); */

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
