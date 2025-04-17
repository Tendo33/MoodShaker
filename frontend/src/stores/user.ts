import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
	state: () => ({
		userId: localStorage.getItem("userId") || "",
		sessionId: localStorage.getItem("sessionId") || "",
	}),

	actions: {
		setUserId(id: string) {
			this.userId = id;
			localStorage.setItem("userId", id);
		},

		setSessionId(id: string) {
			this.sessionId = id;
			localStorage.setItem("sessionId", id);
		},
	},
});
