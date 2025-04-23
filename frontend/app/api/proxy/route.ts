// Add a new API proxy route to handle CORS issues in development
import { type NextRequest, NextResponse } from "next/server";

// This proxy helps avoid CORS issues during development
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { url, method = "POST", headers = {}, data } = body;

		if (!url) {
			return NextResponse.json({ error: "URL is required" }, { status: 400 });
		}

		const response = await fetch(url, {
			method,
			headers: {
				"Content-Type": "application/json",
				...headers,
			},
			body: data ? JSON.stringify(data) : undefined,
		});

		const responseData = await response.json();

		return NextResponse.json(responseData, { status: response.status });
	} catch (error) {
		console.error("API proxy error:", error);
		return NextResponse.json({ error: "Failed to proxy request" }, { status: 500 });
	}
}

export async function GET(request: NextRequest) {
	try {
		const url = request.nextUrl.searchParams.get("url");

		if (!url) {
			return NextResponse.json({ error: "URL is required" }, { status: 400 });
		}

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
		return NextResponse.json({ error: "Failed to proxy request" }, { status: 500 });
	}
}
