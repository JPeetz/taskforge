import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function isValidEmail(email: string): boolean {
  // RFC 5322 compliant email regex
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { name, email } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email.trim())) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Check Supabase configuration
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Supabase environment variables are not configured.");
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again later." },
        { status: 500 }
      );
    }

    // Create Supabase client with service role for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Check for duplicate email
    const { data: existing, error: lookupError } = await supabase
      .from("waitlist")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (lookupError) {
      console.error("Supabase lookup error:", lookupError);
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "You're already on the waitlist!",
      });
    }

    // Insert into waitlist
    const { error: insertError } = await supabase.from("waitlist").insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      source: "landing_page",
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error("Supabase insert error:", insertError);

      // Handle unique constraint violation gracefully
      if (insertError.code === "23505") {
        return NextResponse.json({
          success: true,
          message: "You're already on the waitlist!",
        });
      }

      return NextResponse.json(
        { error: "Failed to join waitlist. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
