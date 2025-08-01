import { NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()


export async function POST(request: NextRequest) {
    const{botId,leadId,content,conversationId,sender} = await request.json();


await prisma.message.create({ data:{
content,
sender,
botId:botId,
leadId,

conversationId
}})

}
