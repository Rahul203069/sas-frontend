import React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
  disabled?: boolean;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'bordered';
}

const sizeClasses = {
  sm: 'py-2 pl-3 pr-10 text-sm',
  md: 'py-3 pl-4 pr-12 text-base',
  lg: 'py-4 pl-5 pr-14 text-lg'
};

const variantClasses = {
  default: 'bg-white/95 backdrop-blur-sm border border-gray-200/80 shadow-sm hover:shadow-md hover:border-gray-300/80',
  minimal: 'bg-transparent border-b-2 border-gray-200 hover:border-gray-300 shadow-none rounded-none',
  bordered: 'bg-white border-2 border-gray-300 hover:border-gray-400 shadow-none'
};

export function Select({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  label,
  error,
  disabled = false,
  className = "",
  size = 'md',
  variant = 'default'
}: SelectProps) {
  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <Listbox.Button 
            className={`
              relative w-full cursor-pointer rounded-xl text-left 
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
              transition-all duration-200 ease-out
              ${sizeClasses[size]}
              ${variantClasses[variant]}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}
            `}
          >
            <span className="flex items-center gap-3">
              {selectedOption?.icon && (
                <span className="flex-shrink-0 text-gray-500">
                  {selectedOption.icon}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <span className={`block truncate font-medium ${
                  selectedOption ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {selectedOption?.label || placeholder}
                </span>
                {selectedOption?.description && (
                  <span className="block text-xs text-gray-400 truncate mt-0.5">
                    {selectedOption.description}
                  </span>
                )}
              </div>
              {selectedOption?.color && (
                <span 
                  className={`h-2.5 w-2.5 rounded-full ${selectedOption.color}`}
                  aria-hidden="true"
                />
              )}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown
                className={`text-gray-400 transition-transform duration-200 ui-open:rotate-180 ${
                  size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
                }`}
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Transition
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-xl bg-white/95 backdrop-blur-sm border border-gray-200/80 shadow-xl ring-1 ring-black/5 focus:outline-none">
              <div className="py-2">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    className={({ active }) =>
                      `relative cursor-pointer select-none transition-colors duration-150 ${
                        size === 'sm' ? 'py-2 pl-3 pr-10' : size === 'lg' ? 'py-4 pl-5 pr-14' : 'py-3 pl-4 pr-12'
                      } ${
                        option.disabled 
                          ? 'opacity-50 cursor-not-allowed text-gray-400'
                          : active 
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-900' 
                            : 'text-gray-900 hover:bg-gray-50'
                      }`
                    }
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center gap-3">
                          {option.icon && (
                            <span className={`flex-shrink-0 transition-colors duration-150 ${
                              option.disabled 
                                ? 'text-gray-300'
                                : active 
                                  ? 'text-blue-600' 
                                  : 'text-gray-500'
                            }`}>
                              {option.icon}
                            </span>
                          )}
                          <div className="flex-1 min-w-0">
                            <span className={`block truncate font-medium ${
                              option.disabled
                                ? 'text-gray-400'
                                : selected 
                                  ? 'text-blue-600' 
                                  : active 
                                    ? 'text-blue-900' 
                                    : 'text-gray-900'
                            }`}>
                              {option.label}
                            </span>
                            {option.description && (
                              <span className={`block text-xs truncate mt-0.5 ${
                                option.disabled
                                  ? 'text-gray-300'
                                  : active 
                                    ? 'text-blue-700' 
                                    : 'text-gray-400'
                              }`}>
                                {option.description}
                              </span>
                            )}
                          </div>
                          {option.color && (
                            <span 
                              className={`h-2.5 w-2.5 rounded-full ${option.color} ${
                                option.disabled ? 'opacity-50' : ''
                              }`}
                              aria-hidden="true"
                            />
                          )}
                        </div>

                        {selected && !option.disabled && (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                            <Check 
                              className={`text-blue-600 transition-all duration-200 ${
                                size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
                              }`}
                              aria-hidden="true" 
                            />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </div>
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <span className="w-4 h-4">⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
}