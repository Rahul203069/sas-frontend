//@ts-nocheck
"use client"

import React, { Dispatch, SetStateAction, useState } from 'react';

import { ChevronLeft, ChevronRight, Shield, Terminal, Timer, TrendingUp, Zap } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { TbInfoTriangleFilled } from "react-icons/tb";

import { PhoneInput } from '@/components/ui/PhoneInput';

import { ImInfo } from "react-icons/im";

import SyncLoader from 'react-spinners/SyncLoader'

import { AddareaCode, sendotp, verifyOtp } from '../action';

import { toast } from 'sonner';

import { useRouter } from 'next/navigation';

import ClipLoader from 'react-spinners/ClipLoader';
type Step = 'phone' | 'otp' | 'zipcode';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => (
  <div className="flex items-center justify-center space-x-2 mb-8">
    {Array.from({ length: totalSteps }).map((_, index) => (
      <div
        key={index}
        className={`h-2 w-16 rounded-full transition-all duration-300 ${
          index < currentStep ? 'w-8 bg-gray-800' : 'bg-gray-200'
        }`}
      />
    ))}
  </div>
);

const LoginFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
const [country, setcountry]: [string, Dispatch<SetStateAction<string>>] = useState('');
const [loader, setloader] = useState(false)
const Router=useRouter()
  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const validateOtp = (code: string) => {
    return code.length === 6 && /^\d+$/.test(code);
  };

  const validateZipCode = (zip: string) => {
    return /^\d{5}(-\d{4})?$/.test(zip);
  };

  const handleContinue = async() => {
      setloader(true)
    setError('');

    if (currentStep === 'phone') {
      if (false) {
        setError('Please  a valid phone number (XXX-XXX-XXXX)');
        return;
      }

const otpsent=await sendotp(`${country}${phoneNumber}`)

if(otpsent?.error){
  setloader(false)
    return
}

setloader(false)

      setCurrentStep('otp');
    } else if (currentStep === 'otp') {





      if (!validateOtp(otp)) {
        setError('Please enter a valid 6-digit code');
        return;
      }


const verifyotp= await verifyOtp(otp)
if(verifyotp.success){
(setloader(false))
  setCurrentStep('zipcode');
  
}else{
  setloader(false)
  toast(verifyotp.error)
  
}
if(verifyotp.redirect){
  Router.replace(verifyotp.redirect)
setloader(false)
}

return

    } else {
      if (!validateZipCode(zipCode)) {

      
      }

    const arecode=  await AddareaCode(zipCode);
    if(arecode?.redirect){

      Router.replace(arecode?.redirect);

    }
    if(arecode?.error){
      toast(arecode.error);
      setloader(false)
      return;
    }
      // Handle successful login
      console.log('Login successful');
    }
    
  };

  const handleBack = () => {
    setError('');
    if (currentStep === 'otp') setCurrentStep('phone');
    if (currentStep === 'zipcode') setCurrentStep('otp');
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };



 

  const getStepNumber = () => {
    switch (currentStep) {
      case 'phone':
        return 1;
      case 'otp':
        return 2;
      case 'zipcode':
        return 3;
      default:
        return 1;
    }
  };

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
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">LeadAI Pro</h1>
            <p className="text-blue-200 text-sm">AI-Powered Lead Intelligence</p>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Get Started in Minutes
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed">
            Complete your setup to start receiving AI-qualified leads and automated call bookings for your business.
          </p>
        </div>
      </div>

      {/* Setup Benefits */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center text-white">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
            <Shield className="w-4 h-4" />
          </div>
          <span className="text-sm">Secure phone verification</span>
        </div>
        <div className="flex items-center text-white">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
            <Zap className="w-4 h-4" />
          </div>
          <span className="text-sm">Instant lead notifications</span>
        </div>
        <div className="flex items-center text-white">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-sm">Location-based lead matching</span>
        </div>
      </div>
    </div>

    {/* Right Side - Onboarding Form */}
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        {/* Mobile Logo */}
        <div className="lg:hidden text-center">
          <div className="inline-flex items-center mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">LeadAI Pro</h1>
              <p className="text-blue-600 text-xs">Setup Your Account</p>
            </div>
          </div>
        </div>

        {/* Onboarding Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="space-y-6">
            {/* Step Indicator */}
            <StepIndicator currentStep={getStepNumber()} totalSteps={3} />

            {/* Step Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentStep === 'phone' && 'Verify Your Phone'}
                {currentStep === 'otp' && 'Enter Verification Code'}
                {currentStep === 'zipcode' && 'Set Your Location'}
              </h2>
              <p className="text-gray-600">
                {currentStep === 'phone' && 'We\'ll send you lead notifications here'}
                {currentStep === 'otp' && `Code sent to ${phoneNumber}`}
                {currentStep === 'zipcode' && 'Help us find local leads for you'}
              </p>
            </div>

            {/* Phone Step Alert */}
            {currentStep === 'phone' && (
              <Alert className="border-blue-200 bg-blue-50">
                <Zap className="w-4 h-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Important</AlertTitle>
                <AlertDescription className="text-blue-700">
                  This number will receive all lead alerts and booking confirmations
                </AlertDescription>
              </Alert>
            )}

            {/* Form Steps */}
            <div className="space-y-6">
              {currentStep === 'phone' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Phone Number
                  </label>
                  <PhoneInput 
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    setcountry={setcountry}
                  />
                </div>
              )}

              {currentStep === 'otp' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400 transition-all duration-200 text-center text-lg font-mono"
                    maxLength={6}
                  />
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <button
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                      onClick={async() => {
                        const otpsend = await sendotp(country + phoneNumber);
                        if(otpsend?.success){
                          toast('OTP sent successfully')
                        } else {
                          toast(otpsend?.error)
                        }
                      }}
                    >
                      Resend Code
                    </button>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Timer className="w-4 h-4 mr-1" />
                      <span>{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 'zipcode' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="Enter your ZIP code"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400 transition-all duration-200"
                    maxLength={10}
                  />
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {currentStep !== 'phone' && (
                  <button
                    onClick={handleBack}
                    className="flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl text-gray-700 transition-all duration-200 font-medium group"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-0.5" />
                    Back
                  </button>
                )}
                <button
                  disabled={loader}
                  onClick={async() => {await handleContinue()}}
                  className={`flex items-center justify-center px-6 py-3 bg-gray-900 hover:bg-gray-800 rounded-xl text-white transition-all duration-200 font-semibold flex-1 group hover:scale-[1.02] shadow-lg ${loader && 'opacity-60 cursor-not-allowed'}`}
                >
                  {loader ? (
                    <SyncLoader size={14} color='white' />
                  ) : (
                    <>
                      <span>{currentStep === 'zipcode' ? 'Complete Setup' : 'Continue'}</span>
                      {currentStep !== 'zipcode' && (
                        <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Help Text */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
);
};

export default LoginFlow;
