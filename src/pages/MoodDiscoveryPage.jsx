
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowLeft,
  Smile,
  CloudRain,
  Coffee,
  Brain,
  Zap,
  Heart,
  Play,
  Shuffle,
} from 'lucide-react';

import { useMusicPlayer } from '../context/MusicPlayerContext';
import { MOODS, INITIAL_PLAYLISTS } from '../data/mockData';
import { apiService } from '../services/apiService';
import SongCard from '../components/music/SongCard';
import SongRow from '../components/music/SongRow';
import PlaylistCard from '../components/music/PlaylistCard';
import LanguageFilter from '../components/common/LanguageFilter';
import EmptyState from '../components/common/EmptyState';

const MOOD_ICONS = {
  Smile,
  CloudRain,
  Coffee,
  Brain,
  Zap,
  Heart,
};

const normalizeMood = (value) =>
  String(value || '').trim().toLowerCase();

export default function MoodDiscoveryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialMood = searchParams.get('mood') || 'happy';

  const [activeMoodId, setActiveMoodId] = useState(
    normalizeMood(initialMood)
  );
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [viewMode, setViewMode] = useState('grid');

  // Songs are fetched from Django, not mockData.js.
  const [databaseSongs, setDatabaseSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { playSong } = useMusicPlayer();

  useEffect(() => {
    const urlMood = searchParams.get('mood');

    if (urlMood) {
      setActiveMoodId(normalizeMood(urlMood));
    }
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    async function loadSongs() {
      setLoading(true);
      setError('');

      try {
        const songs = await apiService.getSongs();

        if (!cancelled) {
          setDatabaseSongs(Array.isArray(songs) ? songs : []);
        }
      } catch (err) {
        console.error('Failed to load mood songs:', err);

        if (!cancelled) {
          setError(
            'Unable to load songs. Check that your Django backend is running.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSongs();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelectMood = (moodId) => {
    setActiveMoodId(normalizeMood(moodId));
    setSearchParams({ mood: moodId });
  };

  const activeMoodObj =
    MOODS.find(
      (mood) => normalizeMood(mood.id) === activeMoodId
    ) || MOODS[0];

  const IconComponent =
    MOOD_ICONS[activeMoodObj.icon] || Smile;

  // Filter actual Django songs by the selected mood and language.
  const matchingSongs = databaseSongs.filter((song) => {
    const songMood = normalizeMood(song.mood);
    const selectedMood = normalizeMood(activeMoodObj.name);

    const matchMood =
      songMood === activeMoodId ||
      songMood === selectedMood;

    const matchLanguage =
      selectedLanguage === 'All' ||
      normalizeMood(song.language) ===
        normalizeMood(selectedLanguage);

    return matchMood && matchLanguage;
  });

  // Playlists remain based on the existing mock data for now.
  const matchingPlaylists = INITIAL_PLAYLISTS.filter((playlist) => {
    const playlistSongIds = (playlist.songIds || []).map(String);

    return databaseSongs.some(
      (song) =>
        playlistSongIds.includes(String(song.id)) &&
        normalizeMood(song.mood) === activeMoodId
    );
  });

  const handlePlayAll = () => {
    if (matchingSongs.length > 0) {
      playSong(matchingSongs[0], matchingSongs);
    }
  };

  const handleShufflePlay = () => {
    if (matchingSongs.length > 0) {
      const shuffled = [...matchingSongs].sort(
        () => Math.random() - 0.5
      );

      playSong(shuffled[0], shuffled);
    }
  };

  return (
    <div className="px-4 sm:px-8 py-6 max-w-7xl mx-auto space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Page title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-700/40 text-purple-300 text-xs font-semibold mb-2">
          <Compass className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>Multilingual Mood Spectrum</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Mood Discovery
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
          Select your emotional frequency. Tune in to Telugu,
          Hindi, Tamil and English tracks curated for how you
          want to feel right now.
        </p>
      </div>

      {/* Mood selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {MOODS.map((mood) => {
          const isSelected =
            activeMoodId === normalizeMood(mood.id);

          const Icon = MOOD_ICONS[mood.icon] || Smile;

          return (
            <button
              key={mood.id}
              onClick={() => handleSelectMood(mood.id)}
              className={`p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between min-h-[90px] cursor-pointer ${
                isSelected
                  ? `bg-gradient-to-br ${mood.colorFrom} ${mood.colorTo} bg-[#1B1C2E] border-[#8B5CF6] shadow-lg shadow-purple-600/20 scale-[1.02]`
                  : 'bg-[#1B1C2E] border-purple-900/30 hover:border-purple-600/40 hover:bg-[#202237]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Icon
                  className="w-5 h-5"
                  style={{
                    color: isSelected
                      ? mood.accentColor
                      : '#A1A1AA',
                  }}
                />

                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" />
                )}
              </div>

              <div>
                <div className="text-sm font-bold text-white mt-2">
                  {mood.name}
                </div>
                <div className="text-[10px] text-zinc-400 line-clamp-1">
                  {mood.tagline}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active mood banner */}
      <div
        className={`rounded-3xl p-6 sm:p-8 bg-gradient-to-r ${activeMoodObj.colorFrom} ${activeMoodObj.colorTo} bg-[#1B1C2E] border ${activeMoodObj.borderColor} relative overflow-hidden shadow-2xl`}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg"
                style={{ color: activeMoodObj.accentColor }}
              >
                <IconComponent className="w-6 h-6" />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {activeMoodObj.name} Vibes
                </h2>
                <div className="text-xs text-purple-200">
                  {activeMoodObj.tagline}
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed pt-1">
              {activeMoodObj.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handlePlayAll}
              disabled={matchingSongs.length === 0}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#7C3AED] hover:to-[#9333EA] shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Play All</span>
            </button>

            <button
              onClick={handleShufflePlay}
              disabled={matchingSongs.length === 0}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white bg-[#10111B]/80 hover:bg-[#10111B] border border-purple-800/40 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Shuffle className="w-4 h-4" />
              <span>Shuffle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Language and view controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="space-y-1.5">
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Language Filter
          </div>

          <LanguageFilter
            selectedLanguage={selectedLanguage}
            onSelectLanguage={setSelectedLanguage}
            includeAll={true}
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-zinc-400">
            {loading
              ? 'Loading songs...'
              : `${matchingSongs.length} track${matchingSongs.length === 1 ? '' : 's'}`}
          </span>

          <div className="flex items-center bg-[#1B1C2E] p-1 rounded-lg border border-purple-900/30">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#8B5CF6] text-white font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Grid
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[#8B5CF6] text-white font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Database song results */}
      {loading ? (
        <div className="py-12 text-center text-sm text-zinc-400">
          Loading songs from your music library...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-5 text-sm text-red-300">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-3 underline hover:text-white"
          >
            Try again
          </button>
        </div>
      ) : matchingSongs.length === 0 ? (
        <EmptyState
          title={`No ${activeMoodObj.name} songs in ${selectedLanguage}`}
          description="Add songs in Django Admin and select this mood, or switch the language filter to All."
          actionLabel="Show All Languages"
          onAction={() => setSelectedLanguage('All')}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {matchingSongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              showMood={true}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#1B1C2E]/60 rounded-2xl p-2 border border-purple-900/30 divide-y divide-purple-950/40">
          {matchingSongs.map((song, index) => (
            <SongRow
              key={song.id}
              song={song}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Existing curated playlists */}
      {matchingPlaylists.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-purple-900/20">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">
              Curated {activeMoodObj.name} Playlists
            </h3>
            <span className="text-xs text-zinc-400">
              Handcrafted selections
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {matchingPlaylists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
