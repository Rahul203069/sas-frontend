//@ts-nocheck

// app/api/auth/google-calendar/route.ts
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

const oauth2Client = new google.auth.OAuth2(
  process.env.ID,
  process.env.SECRET,
  process.env.NEXT_PUBLIC_BASE_URL + "/api/auth/google-calendar/callback"
);

export async function GET(req: NextRequest) {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/calendar"],
  });

  console.log("Redirecting to:", url);

  return NextResponse.json({ redirect: url });
}
