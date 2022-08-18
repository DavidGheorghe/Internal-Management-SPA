<script setup lang="ts">
import TopNavBar from '@/components/menu/TopNavBar.vue';
import LoadingView from './views/LoadingView.vue';

const styles = {
	'margin-top': '7vh',
	'height': 'calc(100% - 7vh)'
}
</script>

<template>
    <header>
      <TopNavBar v-show="$route.path !== '/login'"/>
    </header>
      <!-- <KeepAlive> -->
	<Suspense> 
    <!-- <div class="page"> -->
      <router-view :style="styles"></router-view>
    <!-- </div> -->
		<!-- <template #fallback> -->
        <!-- <h1>ASDDDDDDDDDDDDD</h1> -->
        <!-- <LoadingView /> -->
		<!-- </template> -->
	</Suspense>
  <!-- </KeepAlive> -->
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0");
@import "@/assets/colors.less";

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
.loading-view-container, .asd {
    height: 100%;
    width: 100%;
	display: flex;
}
</style>
