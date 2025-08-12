import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { botId, leadId, content, conversationId, sender, smsCapable } =
      await request.json();

      console.log("Received data:", {
        botId,
        leadId,
        content,    
        conversationId,
        sender,
        smsCapable})
      
    // Basic validation
    if (!botId || !leadId || !content || !conversationId || !sender) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update lead only if smsCapable is provided
    if (smsCapable !== undefined && smsCapable !== null) {
      await prisma.lead.update({
        where: { id: leadId },
        data: { smscapablephone: smsCapable },
      });
    }


    // Create message
    const message = await prisma.message.create({
      data: {
        content,
        sender,
        botId,
        leadId,
        conversationId,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
