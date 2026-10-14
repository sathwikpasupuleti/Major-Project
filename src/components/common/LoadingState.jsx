import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading music...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-center">
      <Loader2 className="w-8 h-8 text-[#8B5CF6] animate-spin mb-3" />
      <p className="text-xs text-zinc-400 font-medium tracking-wide">{message}</p>
    </div>
  );
}
