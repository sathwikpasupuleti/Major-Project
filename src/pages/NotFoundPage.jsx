import React from 'react';
import { Link } from 'react-router-dom';
import { Music2, Home, Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#10111B] flex flex-col justify-center items-center px-4 py-12 text-center relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Brand */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#A855F7] flex items-center justify-center text-white shadow-xl shadow-purple-600/30">
          <Music2 className="w-6 h-6 fill-current" />
        </div>
        <div className="text-left">
          <div className="text-2xl font-black tracking-wider text-white">RAGAA</div>
          <div className="text-xs text-purple-400 font-medium">Every mood. Every beat.</div>
        </div>
      </div>

      <div className="bg-[#1B1C2E] border border-purple-900/40 rounded-3xl p-8 sm:p-12 max-w-md w-full shadow-2xl relative z-10 space-y-4">
        <div className="text-6xl sm:text-7xl font-black bg-gradient-to-r from-[#8B5CF6] via-purple-300 to-[#A855F7] bg-clip-text text-transparent">
          404
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Track Not Found</h1>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          The frequency you are searching for does not exist on Ragaa or was moved to another rhythm.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            to="/home"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#7C3AED] hover:to-[#9333EA] shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/mood-discovery"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-[#10111B] border border-purple-900/40 flex items-center justify-center gap-2 transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Moods</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
