import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { leadId, phone } = body;

    // Validate inputs
    if (!leadId || !Array.isArray(phone) || !phone.every(p => typeof p === "string")) {
      return NextResponse.json(
        { error: "Invalid input. 'leadId' must be provided and 'phone' must be an array of strings." },
        { status: 400 }
      );
    }

    // Update the database
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: { smscapablephone: { push: phone }, state:'INITIATED' },
    });

    return NextResponse.json({ success: true, lead: updatedLead });
  } catch (error: any) {
    console.error("Error in /api/worker/updateLeadPhone:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  } finally {
    // Important for serverless environments (like Vercel)
    await prisma.$disconnect();
  }
}