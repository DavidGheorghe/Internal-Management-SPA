<script setup lang="ts">
defineProps({
	active: Boolean,
	text: String,
});
</script>

<template>
	<div v-if="active" class="loader-wrapper">
		<div class="loader">
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
		<p>{{ text }}</p>
	</div>
</template>

<style scoped lang="less">
@import "@/assets/colors.less";

p {
	font-size: 0.8em;
	font-weight: 300;
	margin-top: 5px;
	letter-spacing: 1px;
	color: rgb(82, 82, 82);
}
.loader-wrapper {
	text-align: center;
}
.loader {
	display: inline-block;
	position: relative;
	width: 50px;
	height: 50px;
}
.loader div {
	box-sizing: border-box;
	display: block;
	position: absolute;
	width: 44px;
	height: 44px;
	margin: 8px;
	border: 8px solid @custom-green;
	border-radius: 50%;
	animation: loader 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
	border-color: @custom-green transparent transparent transparent;
}
.loader div:nth-child(1) {
	animation-delay: -0.45s;
}
.loader div:nth-child(2) {
	animation-delay: -0.3s;
}
.loader div:nth-child(3) {
	animation-delay: -0.15s;
}
@keyframes loader {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
</style>