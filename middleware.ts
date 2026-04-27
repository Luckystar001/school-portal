import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // --- FIX 1: EXEMPT THE PUBLIC STAFF PAGE ---
  // If the user is just visiting the public info page, let them through immediately
  if (pathname === "/staff") {
    return response;
  }

  // 1. AUTH CHECK: Redirect to login if accessing protected routes
  if (
    !user &&
    (pathname.startsWith("/admin") ||
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/staff/") || // Added trailing slash to only protect sub-routes
      pathname === "/complete-profile")
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", user.id)
      .maybeSingle();

    // 2. ONBOARDING CHECK
    if (
      !profile &&
      pathname !== "/complete-profile" &&
      !pathname.startsWith("/auth")
    ) {
      return NextResponse.redirect(new URL("/complete-profile", request.url));
    }

    // 3. STAFF/ADMIN REDIRECTION FROM STUDENT DASHBOARD
    if (pathname === "/dashboard") {
      if (profile?.user_type === "staff") {
        return NextResponse.redirect(new URL("/staff/dashboard", request.url));
      }
      if (profile?.user_type === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }

    // 4. ROLE-BASED PROTECTION
    if (pathname.startsWith("/admin") && profile?.user_type !== "admin") {
      const redirectPath =
        profile?.user_type === "staff" ? "/staff/dashboard" : "/dashboard";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    // --- FIX 2: ONLY PROTECT STAFF SUB-ROUTES ---
    // Change startsWith("/staff") to startsWith("/staff/") so the public page stays free
    if (
      pathname.startsWith("/staff/") &&
      profile?.user_type !== "staff" &&
      profile?.user_type !== "admin"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/staff/:path*", // This covers sub-pages, we handle the root /staff inside the function
    "/complete-profile",
  ],
};
