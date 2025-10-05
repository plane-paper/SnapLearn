import { NextResponse, type NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("Middleware running for:", pathname); // Debug log

  // Protected routes: check session
  const session = await auth0.getSession(request);
  console.log("Session:", session?.user ? "Found" : "Not found"); // Debug log

  // Define public URLs
  const publicPaths = ["/", "/auth/login", "/auth/callback"];

  // Check if current path is public
  if (!publicPaths.includes(pathname) && !session?.user) {
    console.log("Redirecting to login"); // Debug log
    // Redirect unauthenticated users to login
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(url);
    
  }
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)",
  ],
};