//@ts-nocheck


import React from 'react'
import { getCalendarEvents } from '../action'

const page = async() => {
const data=  await getCalendarEvents();

  return (



    <div className='w-full h- full flex justify-center'>
      
      
      {JSON.stringify(data)}
      
       appointmnets will appear here </div>
  )
}

export default page
