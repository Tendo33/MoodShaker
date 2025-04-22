import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { install as i18nInstall } from "./modules/i18n";
import { useThemeStore } from "./stores/theme";

// 导入全局样式
import "./styles/main.css";

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
// 使用 Vite 的 glob 导入功能
Object.values(import.meta.glob<{ install: UserModule["install"] }>("./modules/*.ts", { eager: true })).forEach(
	(module) => {
		// 跳过已经手动安装的 i18n 模块
		if (module.install && module.install !== i18nInstall) {
			module.install({ app, router });
		}
	}
);

// 初始化主题
const themeStore = useThemeStore(); // Move this line before initApp

// 挂载应用
app.mount("#app");

const initApp = async () => {
	// 初始化主题
	themeStore.initTheme();
};

// 启动应用
initApp().catch(console.error);

// 导出应用实例（用于测试或其他用途）
export { app, router };
