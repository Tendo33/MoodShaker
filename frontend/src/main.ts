import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { install as i18nInstall } from "./modules/i18n";
import { useThemeStore } from "./stores/theme";
import { useErrorStore } from "./stores/error";

// 导入全局样式
import "./styles/main.css";
import "./styles/theme.css";

// 创建应用实例
const app = createApp(App);

// 使用路由
app.use(router);

// 定义用户模块类型
type UserModule = {
	install: (options: { app: ReturnType<typeof createApp>; router: typeof router }) => void;
};

// 安装 i18n
i18nInstall({ app, router } as any);

// 自动导入并注册所有模块
const modules = import.meta.glob<{ install: UserModule["install"] }>("./modules/*.ts", { eager: true });
Object.values(modules).forEach((module) => {
	if (module.install && module.install !== i18nInstall) {
		module.install({ app, router });
	}
});

// 初始化主题和错误处理
const themeStore = useThemeStore();
const errorStore = useErrorStore();

// 挂载应用
app.mount("#app");

const initApp = async () => {
	try {
		await themeStore.initTheme();
	} catch (error) {
		errorStore.setError(error instanceof Error ? error.message : 'Failed to initialize theme');
	}
};

// 启动应用
initApp().catch((error) => {
	errorStore.setError(error instanceof Error ? error.message : 'Failed to initialize application');
});

// 导出应用实例（用于测试或其他用途）
export { app, router };
