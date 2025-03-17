"use client"
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Shield, Terminal, Timer } from 'lucide-react';
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
const [country, setcountry] = useState('')
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

  setCurrentStep('zipcode');
}
if(verifyotp.redirect){
  Router.replace(verifyotp.redirect)
}
else{
  setloader(false)
  toast(verifyotp.error)
  
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Decorative elements */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-gray-200 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-gray-300 rounded-full opacity-40 blur-3xl"></div>
        
        {/* Main card with enhanced frosted glass effect */}
        <div className="relative backdrop-blur-xl  scale-105 p-8  transition-all duration-300 ">
          <div className="flex justify-center mb-8">
            <Shield className="w-12 h-12 text-gray-800" />
          </div>

          <StepIndicator currentStep={getStepNumber()} totalSteps={3} />

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            {currentStep === 'phone' && 'Welcome'}
            {currentStep === 'otp' && 'Verify Your Identity'}
            {currentStep === 'zipcode' && 'Almost There'}
          </h2>

          <p className="text-center text-gray-600 mb-4">
            {currentStep === 'phone' && 'Please enter your mobile phone number to begin'}
            {currentStep === 'otp' && `Enter the verification code sent to ${phoneNumber}`}
            {currentStep === 'zipcode' && 'Enter your residential ZIP code'}
          </p>

          {currentStep==='phone'&& <Alert  className= ' mb-4 text-blue-500 scale-95  border-blue-500' variant={'default'}>
 <ImInfo></ImInfo>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription className='text-blue-500'>
    This is the number you will recive alerts regarding the leads 
  </AlertDescription>
</Alert>}

          <div className="space-y-6">
            {currentStep === 'phone' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-800 placeholder-gray-400 transition-all duration-200"
                  maxLength={6}
                />
                <div className="flex items-center justify-between mt-4">
                  <button
                    className=" cursor-pointer text-gray-700 text-sm hover:text-gray-900 transition-colors"
                    onClick={async() =>{

                      const otpsend=await sendotp(country+phoneNumber);
                      if(otpsend?.success){
                        toast('otp sendt succesfully')
                      }
                      else{

                        toast(otpsend?.error)
                      }
                      
                    } }
                  >
                    Resend Code
                  </button>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Timer className="w-4 h-4 mr-1" />
                    <span>{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'zipcode' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="Enter ZIP code"
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-800 placeholder-gray-400 transition-all duration-200"
                  maxLength={10}
                />
              </div>
            )}

            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}

            <div className="flex justify-between space-x-4 mt-8">
              {currentStep !== 'phone' && (
                <button
                  onClick={handleBack}
                  className="flex items-center justify-center px-6 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 w-full group"
                >
                  <ChevronLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                  Back
                </button>
              )}
              <button
              disabled={loader}
                onClick={async()=>{await handleContinue()}}
                className= {`flex items-center justify-center px-6 py-3 bg-gray-800 rounded-lg text-white hover:bg-gray-900 transition-all duration-200 w-full group ${loader&&'opacity-60'}`}
              >
       
                {loader&&<SyncLoader size={14} color='white'></SyncLoader>}
                {!loader&&(currentStep === 'zipcode' ? 'Complete' : 'Continue')}
                {!loader&&(currentStep !== 'zipcode' && <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginFlow;