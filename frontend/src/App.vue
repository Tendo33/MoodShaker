<template>
	<div class="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex items-center justify-center">
		<router-view v-slot="{ Component }">
			<transition name="fade" mode="out-in">
				<component :is="Component" class="w-full h-full" />
			</transition>
		</router-view>
	</div>
</template>

<script setup>
// 主应用组件
</script>

<style>
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

body {
	margin: 0;
	font-family:
		-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
		sans-serif;
}
</style>
