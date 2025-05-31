//@ts-nocheck

import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";
import { redirect } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.NEXT_PUBLIC_BASE_URL + "/api/auth/google-calendar/callback"
);

export  async function GET(req: NextApiRequest, res: NextApiResponse) {
  const url =  oauth2Client.generateAuthUrl({
    access_type: "offline",
    client_id: process.env.ID,
    

    prompt: "consent", // Forces account selection
    scope: ["https://www.googleapis.com/auth/calendar"],
  });

  console.log(url);
  console.log("Redirecting to:", url);

   return NextResponse.json({redirect:url});
}
