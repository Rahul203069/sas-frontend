import React, { useState } from 'react';
import { Globe } from 'lucide-react';

// Country codes data
const countries = [
  { code: '+1', name: 'United States', flag: '🇺🇸' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+86', name: 'China', flag: '🇨🇳' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
  { code: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: '+7', name: 'Russia', flag: '🇷🇺' },
  { code: '+55', name: 'Brazil', flag: '🇧🇷' },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function PhoneInput({ value, onChange,setcountry }: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleCountrySelect = (country: typeof countries[0]) => {
    setSelectedCountry(country);
    setcountry(country.code)
    setIsOpen(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-digit characters
    if(e.target.value.length>10){
        return
    }
    console.log(e.target.value)
    const phoneNumber = e.target.value.replace(/\D/g, '');
    onChange(phoneNumber);
  };

  return (
    <div className="relative">

      <div className="flex">
        <div className="relative">
          <button
            type="button"
            className="flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-white text-sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="mr-2">{selectedCountry.flag}</span>
            <span className="mr-2">{selectedCountry.code}</span>
            <Globe className="h-4 w-4 text-gray-400" />
          </button>

          {isOpen && (
            <div className="absolute z-10 mt-1 w-64 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {countries.map((country) => (
                <button
                  key={country.code}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                  onClick={() => handleCountrySelect(country)}
                >
                  <span className="mr-2">{country.flag}</span>
                  <span className="mr-2">{country.name}</span>
                  <span className="text-gray-500">{country.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <input
          type="tel"
          className="flex-1 block w-full rounded-r-md border-gray-300 border focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
          placeholder="Enter phone number"
          value={value}
          onChange={handlePhoneChange}
        />
      </div>
    </div>
  );
}