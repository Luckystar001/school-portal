import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Use request.nextUrl to get the searchParams
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");

  // Explicitly get the origin from the request URL string
  const origin = request.nextUrl.origin;

  // Default to /complete-profile if no next param is found
  const next = searchParams.get("next") ?? "/complete-profile";

  if (code) {
    const supabase = await createClient();

    // Exchange the code for a permanent session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successfully logged in, redirect to the next destination
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error("Auth exchange error:", error.message);
  }

  // If there is no code or an exchange error, send to the login page with an error hint
  return NextResponse.redirect(
    `${origin}/auth/login?error=auth-callback-failed`,
  );
}
