//@ts-nocheck
"use client"
import React, { useState } from 'react';
import { Bot, Phone, TrendingUp, Zap, ArrowRight, Users, Calendar } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from 'sonner';

function page() {
  const [loader, setloader] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-40 right-20 w-24 h-24 border border-white/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-white/20 rounded-full"></div>
        </div>

        {/* Logo & Brand */}
        <div className="relative z-10">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
              <Bot className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">LeadAI Pro</h1>
              <p className="text-blue-200 text-sm">AI-Powered Lead Intelligence</p>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Transform Your Leads Into Revenue
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Our AI automatically nurtures leads, books phone calls, and intelligently sorts prospects as hot, warm, or cold - so you focus on closing deals.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center text-white">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
              <Bot className="w-4 h-4" />
            </div>
            <span className="text-sm">AI-powered lead nurturing & qualification</span>
          </div>
          <div className="flex items-center text-white">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
              <Phone className="w-4 h-4" />
            </div>
            <span className="text-sm">Automated phone call booking</span>
          </div>
          <div className="flex items-center text-white">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-sm">Smart lead scoring: Hot, Cold, Junk</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <div className="inline-flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">LeadAI Pro</h1>
                <p className="text-blue-600 text-xs">AI Lead Intelligence</p>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center space-y-6">
              {/* Welcome Text */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                <p className="text-gray-600">Access your AI lead dashboard</p>
              </div>

              {/* Stats Preview */}
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100">
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mx-auto mb-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-xs text-gray-500">Hot Leads</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-1">
                    <Phone className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-xs text-gray-500">Calls Booked</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mx-auto mb-1">
                    <Bot className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-xs text-gray-500">AI Active</div>
                </div>
              </div>

              {/* Google Sign In Button */}
              <button
                className="w-full group relative"
                onClick={async () => {
                  setloader(true);
                  const result = await signIn("google", { 
                    callbackUrl: "/dashboard", 
                    redirect: false 
                  });
                  if (result?.error) {
                    toast.error(result.error);
                    setloader(false);
                  }
                  setloader(false);
                }}
              >
                <div className="relative flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 rounded-xl transition-all duration-200 hover:bg-gray-800 hover:scale-[1.02] shadow-lg">
                  {!loader ? (
                    <>
                      <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="w-5 h-5"
                      />
                      <span className="font-semibold text-white">Continue with Google</span>
                      <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                    </>
                  ) : (
                    <ClipLoader color="white" size={20} />
                  )}
                </div>
              </button>

              {/* Security Note */}
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <div className="flex items-center justify-center text-blue-700 text-sm">
                  <Zap className="w-4 h-4 mr-2" />
                  <span className="font-medium">Secure SSO Authentication</span>
                </div>
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-500 leading-relaxed">
                By continuing, you agree to our{' '}
                <button className="text-blue-600 hover:text-blue-800 underline decoration-blue-200 hover:decoration-blue-400">Terms of Service</button>
                {' '}and{' '}
                <button className="text-blue-600 hover:text-blue-800 underline decoration-blue-200 hover:decoration-blue-400">Privacy Policy</button>
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              New to LeadAI Pro?{' '}
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Start your free trial
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;