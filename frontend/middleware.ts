import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 这个中间件处理生产环境中的API请求
export function middleware(request: NextRequest) {
	// 获取请求的路径
	const path = request.nextUrl.pathname;

	// 检查请求是否为API
	if (path.startsWith("/api/v1/")) {
		// 从环境变量获取API URL
		const apiUrl = process.env.API_BASE_URL;

		if (!apiUrl) {
			console.error("API_BASE_URL environment variable is not set");
			return NextResponse.json({ error: "API configuration error: API_BASE_URL not set" }, { status: 500 });
		}

		// 为API请求创建新的URL
		const url = new URL(path.replace("/api/v1", ""), apiUrl);

		// 复制所有搜索参数
		request.nextUrl.searchParams.forEach((value, key) => {
			url.searchParams.set(key, value);
		});

		console.log(`Middleware: Rewriting request to ${url.toString()}`);

		// 返回重写到API URL的请求
		return NextResponse.rewrite(url);
	}

	// 如果不是API请求，继续处理
	return NextResponse.next();
}

// 配置中间件仅对API路由运行
export const config = {
	matcher: "/api/v1/:path*",
};
