import { defineStore } from "pinia";

interface UserState {
	userId: string;
	sessionId: string;
}

export const useUserStore = defineStore("user", {
	state: (): UserState => ({
		userId: localStorage.getItem("userId") || "",
		sessionId: localStorage.getItem("sessionId") || "",
	}),

	actions: {
		setUserId(id: string): void {
			this.userId = id;
			localStorage.setItem("userId", id);
		},

		setSessionId(id: string): void {
			this.sessionId = id;
			localStorage.setItem("sessionId", id);
		},

		clearSession(): void {
			this.sessionId = "";
			localStorage.removeItem("sessionId");
		},
	},
});
