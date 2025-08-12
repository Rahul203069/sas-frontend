//@ts-nocheck
import { google } from "googleapis";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const oauth2Client = new google.auth.OAuth2(
  process.env.ID,
  process.env.SECRET,
  process.env.NEXT_PUBLIC_BASE_URL + "/api/auth/google-calendar/callback"
);

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const session = await getServerSession(authOptions);

  console.log(session);
  const code = searchParams.get("code");

  if (!session) {
    redirect("/login");
  }

  if (!code) {
    redirect("/appointments");
    return NextResponse.json({ error: "No authorization code provided!" });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log(tokens);

    if (!tokens) {
      redirect("/new-calendar");
      return NextResponse.json({ error: "No tokens provided!" });
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: { googlecalendarmetadata: JSON.stringify(tokens) },
    });

    oauth2Client.setCredentials(tokens);

    return NextResponse.redirect("http://localhost:3000/appointment");
  } catch (error) {
    console.error("Error fetching access token", error);
    return NextResponse.json({ error: "Failed to get access token" });
  }
}
