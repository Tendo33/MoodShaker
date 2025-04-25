import type React from "react";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { ErrorProvider } from "@/context/ErrorContext";
import { CocktailProvider } from "@/context/CocktailContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ErrorAlert from "@/components/ErrorAlert";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";

// 导入ApiDebugger组件
import ApiDebugger from "@/components/ApiDebugger";

// 配置 Montserrat 字体
const montserrat = Montserrat({
	subsets: ["latin"],
	variable: "--font-montserrat",
	display: "swap",
});

export const metadata: Metadata = {
	title: "MoodShaker - 找到适合您心情的鸡尾酒",
	description: "通过回答几个简单问题，让我们为您推荐完美的鸡尾酒",
	generator: "v0.dev",
};

// 在RootLayout组件中添加ApiDebugger
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning className={montserrat.variable}>
			<body>
				<UserProvider>
					<ThemeProvider>
						<ErrorProvider>
							<CocktailProvider>
								<LanguageProvider>
									<div className="min-h-screen flex flex-col">
										<Header />
										<ErrorAlert />
										<main className="flex-1">{children}</main>
										<Footer />
										<ApiDebugger />
									</div>
								</LanguageProvider>
							</CocktailProvider>
						</ErrorProvider>
					</ThemeProvider>
				</UserProvider>
			</body>
		</html>
	);
}
