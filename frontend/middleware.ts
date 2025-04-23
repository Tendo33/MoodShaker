// Add middleware to handle API requests in production
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This middleware handles API requests in production
export function middleware(request: NextRequest) {
	// Get the pathname of the request
	const path = request.nextUrl.pathname;

	// Check if the request is for the API
	if (path.startsWith("/api/v1/")) {
		// Get the API URL from environment variables
		const apiUrl = process.env.API_BASE_URL || "https://api.moodshaker.com";

		// Create a new URL for the API request
		const url = new URL(path.replace("/api/v1", ""), apiUrl);

		// Copy all search parameters
		request.nextUrl.searchParams.forEach((value, key) => {
			url.searchParams.set(key, value);
		});

		// Return a rewrite to the API URL
		return NextResponse.rewrite(url);
	}

	// Continue with the request if it's not for the API
	return NextResponse.next();
}

// Configure the middleware to run only for API routes
export const config = {
	matcher: "/api/v1/:path*",
};
