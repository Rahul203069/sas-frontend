import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";
import {redirect} from 'next/navigation'
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
const oauth2Client = new google.auth.OAuth2(
  process.env.ID,
  process.env.SECRET,
  process.env.NEXT_PUBLIC_BASE_URL + "/api/auth/google-calendar/callback"
);

const prisma= new PrismaClient();

export  async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);
  const session = await getServerSession(authOptions);
  // Extract the code parameter
  console.log(session);
  const code = searchParams.get("code");
if(!session){
  redirect('/login');
}
  if (!code) {
    redirect('/appointment')
    return res.json({ error: "No authorization code provided!" });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    console.log(tokens);
   if(!tokens){
      redirect('/new-calendar')
      return res.json({ error: "No tokens provided!" });
   }
     await prisma.user.update({
    where:{
      id:session.user.id
     
    },
    data:{googlecalendarmetadata:JSON.stringify(tokens)}
   })
 oauth2Client.setCredentials(tokens);

  
    // Store the access and refresh tokens in your database
    redirect('/appointment')
    return NextResponse.json({ tokens });
  } catch (error) {
    console.error("Error fetching access token", error.response);

    NextResponse.json({ error: "Failed to get access token" });
  }
}
