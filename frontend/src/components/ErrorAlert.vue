<template>
	<div v-if="message" class="fixed top-4 right-4 z-50 max-w-md">
		<div class="bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-start">
			<AlertCircle class="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
			<div class="flex-1">
				<p class="font-medium">出错了</p>
				<p>{{ message }}</p>
			</div>
			<button @click="onClose" class="ml-4 text-white hover:text-red-200">
				<X class="h-5 w-5" />
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { AlertCircle, X } from "lucide-vue-next";

interface Props {
	message: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(e: "close"): void;
}>();

const onClose = (): void => {
	emit("close");
};
</script>
