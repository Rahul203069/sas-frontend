//@ts-nocheck
"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { Bot, Settings, Power } from 'lucide-react';
import { Button } from './ui/button';

interface BotCardProps {
    id: string;
  name: string;
  type: string;
  isLive: boolean;
  onToggleLive: () => void;
  onConfigure: () => void;
}

export function BotCard({ name,id, type, isLive, onToggleLive, onConfigure }: BotCardProps) {

const router =useRouter();

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 p-6 transition-all duration-200 hover:shadow-lg hover:border-gray-300 mb-4 mt-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 group-hover:border-gray-200 transition-colors">
            <Bot className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500 mt-1">{type}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleLive}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isLive ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isLive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          
          <div className="relative group/tooltip">
            <button
              onClick={onConfigure}
              className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:rotate-180"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className="absolute right-0 top-full mt-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md whitespace-nowrap opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 transform translate-y-1 group-hover/tooltip:translate-y-0">
              Configure Bot
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div>
        <div className={`flex items-center ${isLive ? 'text-blue-600' : 'text-gray-500'}`}>
          <Power className="w-4 h-4 mr-1.5"/>
          <span className="text-sm font-medium">{isLive ? 'Live' : 'Offline'}</span>
        </div>
            </div>

            <Button onClick={()=>{router.push(`bot/${id}&${type.split(' ')[0].toLocaleLowerCase()}`)}} variant={'outline'}  className='cursor-pointer'> Chat</Button>
      </div>
    </div>
  );
}
