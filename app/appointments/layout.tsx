import React, { ReactNode } from 'react'
import {PrismaClient} from '@prisma/client'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
const prisma= new PrismaClient();

const layout = async({children}:{children:ReactNode}) => {

    const user = await getServerSession(authOptions);
console.log('user in appointments',user);
    console.log(user);
    if(!user){
        
         return redirect( '/login');
        
    }
    const userinfo=await prisma.user.findUnique({
        where:{
            id:user.user.id
        }
    })


    console.log(userinfo,'calender');
    if(!userinfo){

        return redirect('/login')
    }

    if(!userinfo.googlecalendarmetadata){


        return redirect('/new-calendar')
    }
else{


    
    
    
    
    
    return (
        <div>{children}</div>
    )
}
}

export default layout