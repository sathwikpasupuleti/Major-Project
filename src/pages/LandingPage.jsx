import React from 'react';
import { Link } from 'react-router-dom';
import {
  Music2,
  Sparkles,
  Play,
  Languages,
  Headphones,
  Compass,
  ArrowRight,
  Smile,
  Zap,
  Heart,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { SONGS, MOODS, ASSET_IMAGES } from '../data/mockData';

export default function LandingPage() {
  const { playSong } = useMusicPlayer();

  const featuredSongs = SONGS.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#10111B] text-white flex flex-col selection:bg-[#8B5CF6] selection:text-white">
      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-40 bg-[#10111B]/90 backdrop-blur-xl border-b border-purple-900/20 px-6 lg:px-12 py-4 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <Link to="/" className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#A855F7] flex items-center justify-center text-white shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
            <Music2 className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-xl font-black tracking-wider bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
              RAGAA
            </span>
          </div>
        </Link>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
          <a href="#features" className="hover:text-purple-300 transition-colors whitespace-nowrap shrink-0">
            Features
          </a>
          <a href="#moods" className="hover:text-purple-300 transition-colors whitespace-nowrap shrink-0">
            Mood Discovery
          </a>
          <a href="#languages" className="hover:text-purple-300 transition-colors whitespace-nowrap shrink-0">
            Languages
          </a>
          <a href="#featured" className="hover:text-purple-300 transition-colors whitespace-nowrap shrink-0">
            Featured Hits
          </a>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/login"
            className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-all whitespace-nowrap shrink-0"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#7C3AED] hover:to-[#9333EA] rounded-xl transition-all shadow-lg shadow-purple-600/25 whitespace-nowrap shrink-0 hover:scale-105 active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 lg:px-12 pt-12 pb-20 max-w-7xl mx-auto w-full">
        {/* Glow backdrop effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B1C2E] border border-purple-800/40 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>Next-Gen Multilingual Music Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Music for <br />
              <span className="bg-gradient-to-r from-[#A855F7] via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                Every Mood.
              </span>
            </h1>

            <p className="text-lg text-purple-200/90 font-medium">
              “Every mood. Every beat.”
            </p>

            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discover a universe of music tailored to your emotional vibe and regional roots.
              Stream master-grade songs across Telugu, Hindi, Tamil, and English with real-time mood-driven recommendation.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/register"
                className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#7C3AED] hover:to-[#9333EA] rounded-xl transition-all shadow-xl shadow-purple-600/30 flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <span>Start Listening Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/home"
                className="px-6 py-3 text-sm font-semibold text-zinc-200 hover:text-white bg-[#1B1C2E] hover:bg-[#25273F] border border-purple-900/40 rounded-xl transition-all flex items-center gap-2"
              >
                <span>Browse Catalog</span>
              </Link>
            </div>

            {/* Micro proof points */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>4 Languages Supported</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>6 Mood Spectrum Filters</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Audio Buffer Lag</span>
              </div>
            </div>
          </div>

          {/* Right Hero Artwork Card */}
          <div className="lg:col-span-5 relative z-10">
            <div className="relative rounded-3xl overflow-hidden border border-purple-800/40 bg-[#1B1C2E] shadow-2xl group">
              <img
                src={ASSET_IMAGES.heroBanner}
                alt="Ragaa Music Streaming Concert"
                referrerPolicy="no-referrer"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10111B] via-black/40 to-transparent" />

              {/* Floating interactive now-playing preview */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#1B1C2E]/90 backdrop-blur-md border border-purple-800/40 flex items-center justify-between gap-3">
                <img
                  src={ASSET_IMAGES.teluguAlbumArt}
                  alt="Samajavaragamana"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-semibold text-[#8B5CF6] uppercase tracking-wide">
                    Now Trending · Telugu
                  </span>
                  <div className="text-xs font-bold text-white truncate">
                    Samajavaragamana Flow
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">
                    Sid Sriram · Romantic Mood
                  </div>
                </div>
                <button
                  onClick={() => playSong(featuredSongs[0])}
                  className="w-10 h-10 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md shadow-purple-600/30 cursor-pointer"
                  aria-label="Play song preview"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section id="languages" className="py-16 bg-[#161726]/60 border-y border-purple-900/20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold uppercase tracking-widest text-[#8B5CF6] mb-2">
              Multilingual By Design
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Rooted in Your Favorite Tongues
            </h2>
            <p className="text-sm text-zinc-400 mt-2">
              Seamlessly switch between Telugu chartbusters, Bollywood emotional ballads, Tamil high-octane bass anthems, and international English vibes.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Telugu', native: 'తెలుగు', badge: 'Sid Sriram & DSP Hits', color: 'from-amber-600/20 to-purple-900/30' },
              { name: 'Hindi', native: 'हिन्दी', badge: 'Arijit Singh & Sufi Soul', color: 'from-rose-600/20 to-purple-900/30' },
              { name: 'Tamil', native: 'தமிழ்', badge: 'Anirudh EDM & Rhythms', color: 'from-cyan-600/20 to-purple-900/30' },
              { name: 'English', native: 'English', badge: 'Synthwave & Global Pop', color: 'from-violet-600/20 to-purple-900/30' },
            ].map((lang) => (
              <Link
                key={lang.name}
                to={`/search?language=${lang.name}`}
                className={`p-6 rounded-2xl bg-gradient-to-b ${lang.color} bg-[#1B1C2E] border border-purple-900/40 hover:border-[#8B5CF6] transition-all hover:-translate-y-1 group flex flex-col justify-between min-h-[140px]`}
              >
                <div>
                  <div className="text-xs text-purple-300 font-semibold mb-1">{lang.native}</div>
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-200">
                    {lang.name}
                  </h3>
                </div>
                <div className="text-xs text-zinc-400 mt-4 pt-3 border-t border-purple-950/40 flex items-center justify-between">
                  <span className="truncate">{lang.badge}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mood Discovery Section */}
      <section id="moods" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#8B5CF6] mb-2">
              Emotional Intelligence
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Every Mood. Handcrafted Playlists.
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-lg">
              Match the music to how you actually feel. Whether studying late, lifting heavy, or relaxing after work.
            </p>
          </div>
          <Link
            to="/mood-discovery"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8B5CF6] hover:text-[#A855F7] transition-colors"
          >
            <span>Explore All 6 Moods</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {MOODS.map((m) => (
            <Link
              key={m.id}
              to={`/mood-discovery?mood=${m.name.toLowerCase()}`}
              className="p-5 rounded-2xl bg-[#1B1C2E] border border-purple-900/30 hover:border-[#8B5CF6] hover:bg-[#202237] transition-all text-center flex flex-col items-center group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md"
                style={{ backgroundColor: `${m.accentColor}25`, color: m.accentColor }}
              >
                {m.name === 'Happy' && <Smile className="w-6 h-6" />}
                {m.name === 'Sad' && <Heart className="w-6 h-6" />}
                {m.name === 'Relaxed' && <Headphones className="w-6 h-6" />}
                {m.name === 'Focus' && <Sparkles className="w-6 h-6" />}
                {m.name === 'Workout' && <Zap className="w-6 h-6" />}
                {m.name === 'Romantic' && <Heart className="w-6 h-6 fill-current" />}
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{m.name}</h4>
              <p className="text-[11px] text-zinc-400 line-clamp-2">{m.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Songs Preview */}
      <section id="featured" className="py-16 bg-[#161726]/40 border-t border-purple-900/20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#8B5CF6] mb-1">
                Trending on Ragaa
              </div>
              <h2 className="text-2xl font-bold text-white">Popular Across All Tongues</h2>
            </div>
            <Link
              to="/home"
              className="text-xs font-semibold text-purple-300 hover:text-white flex items-center gap-1"
            >
              <span>Go to Full Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredSongs.map((song) => (
              <div
                key={song.id}
                className="p-3.5 rounded-2xl bg-[#1B1C2E] border border-purple-900/30 hover:border-[#8B5CF6] transition-all group flex flex-col"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-[#121320]">
                  <img
                    src={song.artworkUrl}
                    alt={song.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <button
                    onClick={() => playSong(song)}
                    aria-label={`Play ${song.title}`}
                    className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg shadow-purple-600/40 hover:scale-110 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </button>
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 backdrop-blur-md text-purple-200">
                    {song.language}
                  </span>
                </div>
                <div className="font-semibold text-sm text-white truncate">{song.title}</div>
                <div className="text-xs text-zinc-400 truncate mt-0.5">{song.artist}</div>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-3 pt-2 border-t border-purple-950/40">
                  <span>{song.mood}</span>
                  <span>{song.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-20 px-6 lg:px-12 max-w-5xl mx-auto w-full text-center">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-b from-[#1E1F38] to-[#121324] border border-purple-800/40 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#8B5CF6]/15 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Ready to hear your mood?
          </h2>
          <p className="text-zinc-300 text-sm max-w-md mx-auto mb-8">
            Join Ragaa today. Unlimited streaming across Telugu, Hindi, Tamil, and English with zero subscription paywalls.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#7C3AED] hover:to-[#9333EA] rounded-xl shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
            >
              Create Free Account
            </Link>
            <Link
              to="/home"
              className="px-8 py-3.5 text-sm font-semibold text-zinc-300 hover:text-white bg-[#1B1C2E] hover:bg-[#25273F] border border-purple-900/40 rounded-xl transition-all"
            >
              Explore Without Account
            </Link>
          </div>
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="mt-auto border-t border-purple-900/20 py-8 px-6 lg:px-12 bg-[#0C0D15] text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Music2 className="w-4 h-4 text-[#8B5CF6]" />
            <span className="font-bold text-zinc-300">RAGAA</span>
            <span>· Every mood. Every beat.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/home" className="hover:text-zinc-300 transition-colors">Home</Link>
            <Link to="/mood-discovery" className="hover:text-zinc-300 transition-colors">Moods</Link>
            <Link to="/login" className="hover:text-zinc-300 transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-zinc-300 transition-colors">Sign Up</Link>
          </div>
          <div>© {new Date().getFullYear()} Ragaa Music. College Project Edition.</div>
        </div>
      </footer>
    </div>
  );
}
