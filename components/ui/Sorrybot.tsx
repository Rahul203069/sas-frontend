//@ts-nocheck
import React from 'react'

const Sorrybot = ({description}:{description:string}) => {
  return (
    <div>

  
    <div className='w-full  flex justify-center font-extrabold  text-3xl items-center pt-32 text-gray-400'>

       {description}
    </div>

    </div>
  )
}

export default Sorrybot
