import { type NextRequest, NextResponse } from "next/server";

// 这个代理帮助避免开发环境中的CORS问题
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { url, method = "POST", headers = {}, data } = body;

		if (!url) {
			return NextResponse.json({ error: "URL is required" }, { status: 400 });
		}

		console.log(`Proxying POST request to: ${url}`);

		const response = await fetch(url, {
			method,
			headers: {
				"Content-Type": "application/json",
				...headers,
			},
			body: data ? JSON.stringify(data) : undefined,
		});

		// 检查响应是否为JSON
		const contentType = response.headers.get("content-type");
		if (contentType && contentType.includes("application/json")) {
			const responseData = await response.json();
			return NextResponse.json(responseData, { status: response.status });
		} else {
			// 如果不是JSON，返回文本
			const text = await response.text();
			console.error(`Received non-JSON response: ${contentType}`);
			console.error(`Response text (first 100 chars): ${text.substring(0, 100)}...`);
			return NextResponse.json(
				{
					error: `Invalid response format: expected JSON, got ${contentType || "unknown"}`,
					text: text.substring(0, 500),
				},
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error("API proxy error:", error);
		return NextResponse.json({ error: `Failed to proxy request: ${error}` }, { status: 500 });
	}
}

export async function GET(request: NextRequest) {
	try {
		const url = request.nextUrl.searchParams.get("url");

		if (!url) {
			return NextResponse.json({ error: "URL is required" }, { status: 400 });
		}

		console.log(`Proxying GET request to: ${url}`);

		const response = await fetch(url);

		if (response.headers.get("content-type")?.includes("application/json")) {
			const data = await response.json();
			return NextResponse.json(data, { status: response.status });
		} else {
			const data = await response.text();
			return new NextResponse(data, {
				status: response.status,
				headers: {
					"Content-Type": response.headers.get("content-type") || "text/plain",
				},
			});
		}
	} catch (error) {
		console.error("API proxy error:", error);
		return NextResponse.json({ error: `Failed to proxy request: ${error}` }, { status: 500 });
	}
}
