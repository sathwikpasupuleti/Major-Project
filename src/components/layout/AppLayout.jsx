import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MusicPlayer from '../music/MusicPlayer';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#10111B] text-white flex flex-col">
      {/* Sidebar Navigation (Opens when clicking the 3 lines only) */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area: Full width, spacious, with persistent bottom player padding */}
      <div className="flex flex-col flex-1 min-h-screen w-full">
        <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

        <main className="flex-1 pb-32 sm:pb-28 w-full">
          <Outlet />
        </main>
      </div>

      {/* Persistent Bottom Music Player */}
      <MusicPlayer />
    </div>
  );
}
