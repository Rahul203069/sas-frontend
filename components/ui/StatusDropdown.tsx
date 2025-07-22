import React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';

interface StatusOption {
  value: string;
  label: string;
  color?: string;
  icon?: React.ReactNode;
}

interface StatusDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: StatusOption[];
  placeholder?: string;
}

export function StatusDropdown({ value, onChange, options, placeholder = "Select status" }: StatusDropdownProps) {
  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="relative">
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-white/95 backdrop-blur-sm border border-gray-200/80 py-3.5 pl-4 pr-12 text-left shadow-sm hover:shadow-md hover:border-gray-300/80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ease-out">
            <span className="flex items-center gap-3">
              {selectedOption?.icon && (
                <span className="flex-shrink-0 text-gray-500">
                  {selectedOption.icon}
                </span>
              )}
              <span className={`block truncate font-medium ${selectedOption ? 'text-gray-900' : 'text-gray-500'}`}>
                {selectedOption?.label || placeholder}
              </span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown
                className="h-4 w-4 text-gray-400 transition-transform duration-200 ui-open:rotate-180"
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
                      `relative cursor-pointer select-none py-3 pl-4 pr-12 transition-colors duration-150 ${
                        active 
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-900' 
                          : 'text-gray-900 hover:bg-gray-50'
                      }`
                    }
                    value={option.value}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center gap-3">
                          {option.icon && (
                            <span className={`flex-shrink-0 transition-colors duration-150 ${
                              active ? 'text-blue-600' : 'text-gray-500'
                            }`}>
                              {option.icon}
                            </span>
                          )}
                          <span
                            className={`block truncate font-medium ${
                              selected ? 'text-blue-600' : active ? 'text-blue-900' : 'text-gray-900'
                            }`}
                          >
                            {option.label}
                          </span>
                          {option.color && (
                            <span 
                              className={`ml-auto h-2.5 w-2.5 rounded-full ${option.color}`}
                              aria-hidden="true"
                            />
                          )}
                        </div>

                        {selected && (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                            <Check 
                              className="h-4 w-4 text-blue-600 transition-all duration-200" 
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
    </div>
  );
}