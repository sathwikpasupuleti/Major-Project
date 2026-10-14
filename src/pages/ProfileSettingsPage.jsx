import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  ArrowLeft,
  Mail,
  Languages,
  Shield,
  Sliders,
  LogOut,
  Save,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LANGUAGES } from '../data/mockData';

export default function ProfileSettingsPage() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || 'Sathwik Pasupuleti');
  const [email, setEmail] = useState(user?.email || 'sathwikpasupuleti29@gmail.com');
  const [preferredLanguages, setPreferredLanguages] = useState(
    user?.preferredLanguages || ['Telugu', 'Hindi', 'Tamil', 'English']
  );
  const [audioQuality, setAudioQuality] = useState(user?.audioQuality || 'High (320kbps)');
  const [privateSession, setPrivateSession] = useState(user?.privateSession || false);
  const [savedNotification, setSavedNotification] = useState(false);

  const toggleLanguage = (lang) => {
    if (preferredLanguages.includes(lang)) {
      if (preferredLanguages.length > 1) {
        setPreferredLanguages(preferredLanguages.filter(l => l !== lang));
      }
    } else {
      setPreferredLanguages([...preferredLanguages, lang]);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      preferredLanguages,
      audioQuality,
      privateSession,
    });
    setSavedNotification(true);
    setTimeout(() => {
      setSavedNotification(false);
    }, 2500);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="px-4 sm:px-8 py-6 max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-700/40 text-purple-300 text-xs font-semibold mb-2">
            <User className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Account Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Profile & Settings</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage your personal credentials, streaming quality, and multilingual preferences.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-white bg-red-950/30 hover:bg-red-600/80 border border-red-800/40 transition-all flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {savedNotification && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-200 text-xs font-semibold flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Your profile preferences have been successfully updated in Ragaa!</span>
        </div>
      )}

      {/* Profile Card & Avatar */}
      <div className="bg-[#1B1C2E] border border-purple-900/40 rounded-3xl p-6 sm:p-8 flex items-center gap-6 shadow-xl">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#A855F7] flex items-center justify-center text-white text-3xl font-extrabold ring-4 ring-purple-600/30 shrink-0 shadow-lg">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-white truncate">{name}</h2>
          <p className="text-xs text-zinc-400 mt-0.5 truncate">{email}</p>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-950/60 border border-purple-800/40 text-purple-300 mt-2">
            Ragaa Free Pioneer Member
          </span>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details */}
        <div className="bg-[#1B1C2E] border border-purple-900/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-[#8B5CF6]" />
            <span>Personal Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#10111B] border border-purple-900/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#10111B] border border-purple-900/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
          </div>
        </div>

        {/* Preferred Languages */}
        <div className="bg-[#1B1C2E] border border-purple-900/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Languages className="w-4 h-4 text-[#8B5CF6]" />
              <span>Preferred Streaming Languages</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Customize which regional languages appear prominently on your Home and Mood discovery feeds.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {LANGUAGES.map(lang => {
              const isSelected = preferredLanguages.includes(lang);
              return (
                <button
                  type="button"
                  key={lang}
                  onClick={() => toggleLanguage(lang)}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-950/60 border-[#8B5CF6] text-white shadow-sm'
                      : 'bg-[#10111B] border-purple-900/30 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold">{lang}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-[#8B5CF6]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Streaming & Audio Preferences */}
        <div className="bg-[#1B1C2E] border border-purple-900/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#8B5CF6]" />
            <span>Audio & Playback Quality</span>
          </h3>

          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Streaming Bitrate
              </label>
              <select
                value={audioQuality}
                onChange={(e) => setAudioQuality(e.target.value)}
                className="w-full sm:w-72 bg-[#10111B] border border-purple-900/40 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#8B5CF6]"
              >
                <option value="Normal (96kbps)">Normal (96kbps) - Data Saver</option>
                <option value="High (160kbps)">High (160kbps) - Standard</option>
                <option value="High (320kbps)">Very High (320kbps) - Studio Master</option>
                <option value="Lossless FLAC">Lossless FLAC (Hi-Res Audio)</option>
              </select>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={privateSession}
                  onChange={(e) => setPrivateSession(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#10111B] border border-purple-800 accent-[#8B5CF6]"
                />
                <div>
                  <div className="text-xs font-semibold text-white">Private Listening Session</div>
                  <div className="text-[11px] text-zinc-400">
                    Don't publish recently played tracks to your public profile history.
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#7C3AED] hover:to-[#9333EA] transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
