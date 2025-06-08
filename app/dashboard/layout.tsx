//@ts-nocheck
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient();

type Props = {}

const layout = async({children}:{children:ReactNode}) => {

const session = await getServerSession(authOptions);

if(!session?.user.id){

    redirect('/login');
}


const user=await prisma.user.findUnique({where:{id:session.user.id}})


if(!user){
    redirect('/login')
}
    
  return (
    <div>{children}</div>
  )
}

export default layout
