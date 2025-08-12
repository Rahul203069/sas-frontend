import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


const prisma= new PrismaClient();
export async  function POST( request:NextRequest){


    const {accountSid,to}= await request.json()

   const twiliouser = await prisma.twilio.findFirst({where:{
        sid:accountSid,
        phone:to
    }})



    return NextResponse.json(twiliouser)


}