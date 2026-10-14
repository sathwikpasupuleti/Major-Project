import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MusicPlayerProvider } from './context/MusicPlayerContext';
import AppLayout from './components/layout/AppLayout';

// 15 Screen Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import MoodDiscoveryPage from './pages/MoodDiscoveryPage';
import SearchPage from './pages/SearchPage';
import SongDetailsPage from './pages/SongDetailsPage';
import AlbumDetailsPage from './pages/AlbumDetailsPage';
import MusicPlayerPage from './pages/MusicPlayerPage';
import LibraryPage from './pages/LibraryPage';
import PlaylistDetailsPage from './pages/PlaylistDetailsPage';
import ArtistDetailsPage from './pages/ArtistDetailsPage';
import HistoryPage from './pages/HistoryPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MusicPlayerProvider>
          <Routes>
            {/* 1. Landing & Authentication Pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Authenticated / Core App with Sidebar, Navbar & Persistent Bottom Player */}
            <Route element={<AppLayout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/mood-discovery" element={<MoodDiscoveryPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/songs/:id" element={<SongDetailsPage />} />
              <Route path="/albums/:id" element={<AlbumDetailsPage />} />
              <Route path="/player" element={<MusicPlayerPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/playlists/:id" element={<PlaylistDetailsPage />} />
              <Route path="/artists/:id" element={<ArtistDetailsPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/profile" element={<ProfileSettingsPage />} />
            </Route>

            {/* 15. 404 Not Found Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MusicPlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
