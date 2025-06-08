//@ts-nocheck

'use server'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React, { ReactNode } from 'react'
import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation'


const prisma= new PrismaClient();

const layout = async({children}:{children:ReactNode}) => {
const session =  await getServerSession(authOptions);

if(!session?.user?.id){
    return (

        <div>
            {JSON.stringify(session)}
            {children}</div>
      )
}

const user= await  prisma.user.findUnique({where:{id:session?.user?.id}})
console.log(user)
if(user){

    redirect('/dashboard')

}




}

export default layout
