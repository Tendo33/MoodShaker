<template>
	<transition
		enter-active-class="transform ease-out duration-300 transition"
		enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
		enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
		leave-active-class="transition ease-in duration-200"
		leave-from-class="opacity-100"
		leave-to-class="opacity-0"
	>
		<div
			v-if="message"
			class="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50"
		>
			<div
				class="max-w-sm w-full shadow-lg rounded-lg pointer-events-auto overflow-hidden"
				:class="theme === 'dark' ? 'bg-gray-800' : 'bg-white'"
			>
				<div class="p-4">
					<div class="flex items-start">
						<div class="flex-shrink-0">
							<svg
								class="h-6 w-6 text-red-500"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<div class="ml-3 w-0 flex-1 pt-0.5">
							<p class="text-sm font-medium" :class="theme === 'dark' ? 'text-white' : 'text-gray-900'">错误</p>
							<p class="mt-1 text-sm" :class="theme === 'dark' ? 'text-gray-300' : 'text-gray-700'">
								{{ message }}
							</p>
						</div>
						<div class="ml-4 flex-shrink-0 flex">
							<button
								@click="$emit('close')"
								class="inline-flex text-gray-400 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
								:class="theme === 'dark' ? 'hover:text-gray-300' : 'hover:text-gray-600'"
							>
								<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
									<path
										fill-rule="evenodd"
										d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
										clip-rule="evenodd"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script setup lang="ts">
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);

const props = defineProps({
	message: {
		type: String,
		default: "",
	},
});

const emit = defineEmits(["close"]);

const isVisible = ref(false);

onMounted(() => {
	isVisible.value = !!props.message;
});

watch(
	() => props.message,
	(newValue) => {
		isVisible.value = !!newValue;
	}
);
</script>
