<template>
	<div class="flex items-center justify-center">
		<div class="relative">
			<div class="w-12 h-12 rounded-full absolute border-4 border-solid border-gray-200"></div>
			<div
				class="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-transparent"
				:class="[colorClass, 'border-t-current']"
			></div>
		</div>
		<div v-if="text" class="ml-4 text-lg">{{ text }}</div>
	</div>
</template>

<script setup lang="ts">
interface Props {
	text?: string;
	colorClass?: string;
}

defineProps<Props>();
</script>
