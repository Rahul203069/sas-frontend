//@ts-nocheck


import { PrismaClient } from "@prisma/client";
import e from "express";
import { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { start } from "repl";
const prisma = new PrismaClient();
declare module "next-auth" {
  interface Session {
    user: {
      id: string|null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

 export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.SECRET,
  pages: {
    signIn: "/signup", // Custom sign-in page
  },
  callbacks: {
    async signIn({ user }) {
      try{

        if (!user || !user.email) return false; // Ensure user has an email
        
        // Check if user exists in the database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          select:{bot:true,id:true}
        });

        console.log(existingUser,'existingUser');
        if (existingUser && existingUser.bot.length<2 ) {
          // If user exists and has bots, allow sign-in
        console.log('User exists, proceeding with bot creation',existingUser);

 console.log('User exists, proceeding with bot creation', existingUser);

await prisma.bot.create({
  data: {
    name: "alex",
    type: "BUYER",
    bussinessinfo: "",
    startingmessage: "",
    islive: false,
    appointmentsetter: false,
    user: {
      connect: {
        id: existingUser.id // Connect to existing user
      }
    }
  }
});

await prisma.bot.create({
  data: {
    name: "lisa",
    type: "SELLER",
    bussinessinfo: "",
    startingmessage: "",
    islive: false,
    appointmentsetter: false,
    user: {
      connect: {
        id: existingUser.id // Connect to existing user
      }
    }
  }
});


          return true; // Allow sign-in
          
        }

        
        if (!existingUser) {
          // Create user if they don't exist


    const userdata=  await prisma.user.create({
            data: {
              name: user.name || "Unknown",
              email: user.email,
              image: user.image || "",
              password: "defaultPassword", // Add a default password or generate one
            },
          });
          
       console.log('User exists, proceeding with bot creation', existingUser);

await prisma.bot.create({
  data: {
    name: "alex",
    type: "BUYER",
    bussinessinfo: "",
    startingmessage: "",
    islive: false,
    appointmentsetter: false,
    user: {
      connect: {
        id: userdata.id // Connect to existing user
      }
    }
  }
});

await prisma.bot.create({
  data: {
    name: "lisa",
    type: "SELLER",
    bussinessinfo: "",
    startingmessage: "",
    islive: false,
    appointmentsetter: false,
    user: {
      connect: {
        id: userdata.id // Connect to existing user
      }
    }
  }
});

          
        }
        return true; // Allow sign-in
      } catch (error) {
        console.error('error',error);
        return false;
      }
    },
    async session({ session }) {
      if (session?.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          include:{twilio:true}
        });
        console.log(dbUser,'heheh');

        if (dbUser) {
          session.user.id = dbUser.id; // Attach user ID to session
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`; // Redirect to /home after sign-in
    },
  },
};
