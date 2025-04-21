import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims } = await auth();

  if (!userId || !sessionClaims) return NextResponse.next();

  console.log("User ID:", userId);
  console.log("Session Claims:", sessionClaims);

  const user = await clerkClient.users.getUser(userId);
  const role = user.publicMetadata?.role;

  console.log("User Role:", role);

  const pathname = req.nextUrl.pathname;

  if (pathname === "/" || pathname.startsWith("/sign-in")) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/home", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
