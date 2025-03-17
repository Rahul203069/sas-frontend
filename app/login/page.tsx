"use client"

import React, { useState } from 'react';
import { Chrome } from 'lucide-react';
import { signIn } from 'next-auth/react';

import ClipLoader from "react-spinners/ClipLoader";
import { toast } from 'sonner';

function page() {

const [loader, setloader] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Circles */}
      <div className="absolute top-1/4 -left-10 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -top-8 right-1/4 w-72 h-72 bg-gray-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      {/* Login Card */}
      <div className="relative backdrop-blur-lg bg-white/30 rounded-3xl shadow-xl p-8 w-full max-w-md border border-white/40">
        <div className="text-center space-y-6">
          {/* Logo */}
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl inline-block">
            <Chrome className="h-12 w-12 text-gray-700" />
          </div>

          {/* Welcome Text */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-600">Sign in to continue to Dashboard</p>
          </div>

          {/* Google Sign In Button */}
          <button 
            className="w-full group relative cursor-pointer"
         onClick={async()=>{ setloader(true); const result=  await signIn("google", {callbackUrl: "/csv-upload", redirect: false}) 
        if(result?.error){
            toast.error(result.error)
            setloader(false)
        }

        setloader(false)
        
        
        }}
          >
            {/* Button Background with Gradient Border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-300 to-gray-400 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-200"></div>
            <div className="relative flex items-center justify-center gap-3 px-6 py-3 bg-gray-800 rounded-xl transition duration-200 hover:scale-[1.02] hover:bg-gray-900">
              {!loader?<img 
                src="https://www.google.com/favicon.ico" 
                alt="Google" 
                className="w-8 h-8"
              />:<ClipLoader color="white" size={20} />}
              <span className="font-medium text-white">Continue with Google</span>
            </div>
          </button>

          {/* Terms */}
          <p className="text-sm text-gray-500">
            By continuing, you agree to our{' '}
            <button className="text-gray-600 hover:text-gray-800 underline decoration-gray-300 hover:decoration-gray-500">Terms of Service</button>
            {' '}and{' '}
            <button className="text-gray-600 hover:text-gray-800 underline decoration-gray-300 hover:decoration-gray-500">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default page;