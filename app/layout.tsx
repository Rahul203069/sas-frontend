//@ts-nocheck
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import { Toaster } from "@/components/ui/sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import SessionWrapper from "@/components/SessionWrapper";
import { ThemeProvider } from "@/components/ThemeProvider";



const prisma= new PrismaClient()

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};







export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {





  
  
  
  
  return (
    <html lang="en">
      <script src="https://accounts.google.com/gsi/client" async defer></script>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >

        <SessionWrapper>
      


        {children}
        <Toaster></Toaster>
    
        </SessionWrapper>
          
      </body>
    </html>
  );
}



