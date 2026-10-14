import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Home,
  Compass,
  Search,
  Library,
  History,
  Music2,
  Disc3,
  PlusCircle,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMusicPlayer } from '../../context/MusicPlayerContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const { playlists, createPlaylist } = useMusicPlayer();
  const navigate = useNavigate();

  const handleCreatePlaylist = () => {
    const newPl = createPlaylist(`My Vibe #${playlists.length + 1}`);
    navigate(`/playlists/${newPl.id}`);
    if (onClose) onClose();
  };

  const navLinks = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/mood-discovery', label: 'Mood Discovery', icon: Compass },
    { to: '/search', label: 'Search', icon: Search },
    { to: '/player', label: 'Now Playing', icon: Disc3 },
  ];

  const libraryLinks = [
    { to: '/library', label: 'My Library', icon: Library },
    { to: '/history', label: 'Listening History', icon: History },
  ];

  return (
    <>
      {/* Backdrop (closes sidebar on click outside on all screen sizes) */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 transition-opacity animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Drawer: Opens only when clicking the 3 lines */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#10111B] border-r border-purple-900/40 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header & Close button */}
        <div className="p-5 border-b border-purple-900/30 flex items-center justify-between">
          <Link
            to="/home"
            onClick={onClose}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#A855F7] flex items-center justify-center text-white shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
              <Music2 className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
                RAGAA
              </div>
              <div className="text-[10px] text-purple-400 font-medium tracking-tight">
                Every mood. Every beat.
              </div>
            </div>
          </Link>

          {/* Close X Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Discover */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Menu
            </div>
            <nav className="space-y-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-[#8B5CF6] text-white shadow-md shadow-purple-600/25'
                          : 'text-zinc-400 hover:text-white hover:bg-[#1B1C2E]'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Library Section */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Collection
            </div>
            <nav className="space-y-1">
              {libraryLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-[#8B5CF6] text-white shadow-md shadow-purple-600/25'
                          : 'text-zinc-400 hover:text-white hover:bg-[#1B1C2E]'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Playlists Quick List */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Playlists
              </span>
              <button
                onClick={handleCreatePlaylist}
                className="text-purple-400 hover:text-purple-300 transition-colors p-1 cursor-pointer"
                title="Create playlist"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {playlists.slice(0, 6).map((pl) => (
                <NavLink
                  key={pl.id}
                  to={`/playlists/${pl.id}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs truncate transition-colors ${
                      isActive
                        ? 'text-[#8B5CF6] font-bold bg-[#1B1C2E]'
                        : 'text-zinc-400 hover:text-white hover:bg-[#1B1C2E]/60'
                    }`
                  }
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500/60 shrink-0" />
                  <span className="truncate">{pl.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-purple-900/30 bg-[#0C0D15]">
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#1B1C2E] transition-colors group"
          >
            <div className="w-9 h-9 rounded-full bg-purple-900/60 border border-purple-700/40 flex items-center justify-center text-purple-300 font-bold text-xs shrink-0 group-hover:border-[#8B5CF6]">
              {user ? user.name.charAt(0).toUpperCase() : 'R'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                {user ? user.name : 'Sign In'}
              </div>
              <div className="text-[10px] text-zinc-400 truncate">
                Profile & Settings
              </div>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}
