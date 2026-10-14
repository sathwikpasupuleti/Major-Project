import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu, Search, User, Globe, Sparkles, ChevronRight, Music2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onToggleSidebar }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [quickQuery, setQuickQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(quickQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#10111B]/90 backdrop-blur-md border-b border-purple-900/20 px-3 sm:px-8 flex items-center justify-between gap-3 sm:gap-4">
      {/* Left: 3-Lines Menu Button & Logo Link */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* 3 lines button opens menu drawer on click */}
        <button
          onClick={onToggleSidebar}
          className="p-2 sm:px-3 sm:py-2 rounded-xl text-zinc-200 hover:text-white bg-[#1B1C2E] hover:bg-[#25273F] border border-purple-900/40 transition-all flex items-center gap-2 cursor-pointer shadow-sm group"
          aria-label="Toggle navigation menu"
          title="Open Menu (3 lines)"
        >
          <Menu className="w-5 h-5 text-[#8B5CF6] group-hover:text-[#A855F7] transition-colors" />
          <span className="hidden md:inline text-xs font-bold text-zinc-300 group-hover:text-white">
            Menu
          </span>
        </button>

        {/* Brand Link */}
        <Link to="/home" className="flex items-center gap-2 group ml-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#8B5CF6] to-[#A855F7] flex items-center justify-center text-white shadow-md shadow-purple-600/30">
            <Music2 className="w-4 h-4 fill-current" />
          </div>
          <span className="text-lg font-black tracking-wider bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent hidden sm:inline">
            RAGAA
          </span>
        </Link>

        {/* Page Context Breadcrumb */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-zinc-400 pl-2">
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-zinc-200 capitalize font-medium">
            {location.pathname === '/home'
              ? 'Home'
              : location.pathname.replace('/', '').replace(/-/g, ' ') || 'Stream'}
          </span>
        </div>
      </div>

      {/* Center: Search input */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex-1 max-w-md mx-1 sm:mx-6"
      >
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-purple-400 pointer-events-none" />
          <input
            type="text"
            value={quickQuery}
            onChange={(e) => setQuickQuery(e.target.value)}
            placeholder="Search Telugu, Hindi, Tamil & English music..."
            className="w-full bg-[#1B1C2E] border border-purple-900/30 rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
          />
        </div>
      </form>

      {/* Right: Languages indicator & User profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="hidden md:flex items-center gap-1.5 bg-[#1B1C2E] px-2.5 py-1.5 rounded-xl border border-purple-900/30 text-[11px] text-zinc-300">
          <Globe className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>Telugu · Hindi · Tamil · English</span>
        </div>

        {/* Profile button */}
        <Link
          to="/profile"
          className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-[#1B1C2E] hover:bg-[#25273F] border border-purple-900/30 transition-colors"
          title="Profile & Settings"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#A855F7] flex items-center justify-center text-white font-bold text-xs">
            {user ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="hidden sm:inline text-xs font-semibold text-white max-w-[100px] truncate">
            {user ? user.name.split(' ')[0] : 'Account'}
          </span>
        </Link>
      </div>
    </header>
  );
}
