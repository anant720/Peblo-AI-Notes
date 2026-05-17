import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis conditionally to avoid breaking local dev if env vars are missing
let ratelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  // Create a new ratelimiter, that allows 10 requests per 10 seconds
  ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(10, "10 s"),
    analytics: true,
  });
}

export async function middleware(request: NextRequest) {
  // Only rate limit specific vulnerable paths
  const isAuthRoute = request.nextUrl.pathname.startsWith("/api/auth/signup");
  const isAiRoute = request.nextUrl.pathname.startsWith("/api/ai");

  if ((isAuthRoute || isAiRoute) && ratelimit) {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const { success, pending, limit, reset, remaining } = await ratelimit.limit(
      `ratelimit_${ip}`
    );

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    }
  }

  return NextResponse.next();
}

// Apply middleware to API routes
export const config = {
  matcher: ["/api/auth/signup", "/api/ai"],
};
