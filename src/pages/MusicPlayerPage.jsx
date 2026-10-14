import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Volume2,
  VolumeX,
  ListMusic,
  ArrowLeft,
  Sparkles,
  Music2,
  Trash2,
  Mic2,
  AlertCircle,
} from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import ProgressBar from '../components/music/ProgressBar';
import PlayerControls from '../components/music/PlayerControls';

export default function MusicPlayerPage() {
  const navigate = useNavigate();
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    seekTo,
    volume,
    isMuted,
    setVolumeLevel,
    toggleMute,
    toggleLike,
    isLiked,
    queue,
    playSong,
    removeFromQueue,
    clearQueue,
    audioError,
  } = useMusicPlayer();

  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'lyrics'
  const liked = currentSong ? isLiked(currentSong.id) : false;

  if (!currentSong) {
    return (
      <div className="px-4 py-16 text-center max-w-md mx-auto">
        <Music2 className="w-12 h-12 text-[#8B5CF6] mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">No song is currently playing</h2>
        <p className="text-xs text-zinc-400 mb-6">Choose any song from our multilingual catalog to start listening.</p>
        <Link
          to="/home"
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#8B5CF6]"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <div className="text-xs font-bold uppercase tracking-wider text-purple-300">
          Now Playing Experience
        </div>
      </div>

      {/* Main Grid: Player on Left, Queue/Lyrics on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Big Artwork & Player controls */}
        <div className="lg:col-span-7 bg-[#1B1C2E]/80 border border-purple-900/40 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col items-center text-center">
          {/* Big Artwork */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden shadow-2xl mb-8 ring-2 ring-purple-600/30 group">
            <img
              src={currentSong.artworkUrl}
              alt={currentSong.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-black/70 backdrop-blur-md text-purple-200">
              {currentSong.language}
            </span>
          </div>

          {/* Title & Artist & Like */}
          <div className="w-full flex items-center justify-between mb-6 px-2">
            <div className="text-left min-w-0 flex-1">
              <Link
                to={`/songs/${currentSong.id}`}
                className="block text-2xl font-black text-white hover:text-[#8B5CF6] transition-colors truncate"
              >
                {currentSong.title}
              </Link>
              <div className="flex items-center gap-2 text-sm text-zinc-400 mt-1">
                <Link
                  to={`/artists/${currentSong.artistId}`}
                  className="hover:text-zinc-200 transition-colors truncate font-semibold"
                >
                  {currentSong.artist}
                </Link>
                <span>·</span>
                <Link
                  to={`/albums/${currentSong.albumId}`}
                  className="hover:text-zinc-200 transition-colors truncate"
                >
                  {currentSong.album}
                </Link>
              </div>
            </div>

            <button
              onClick={() => toggleLike(currentSong.id)}
              className="p-3 rounded-full text-zinc-400 hover:text-pink-500 transition-colors cursor-pointer shrink-0"
              aria-label={liked ? 'Unlike' : 'Like'}
            >
              <Heart className={`w-7 h-7 ${liked ? 'fill-pink-500 text-pink-500' : ''}`} />
            </button>
          </div>

          {/* Audio Error Alert if any */}
          {audioError && (
            <div className="w-full mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{audioError}</span>
            </div>
          )}

          {/* Progress Bar with Scrubbing */}
          <div className="w-full mb-6">
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={seekTo}
              showTimes={true}
            />
          </div>

          {/* Big Player Controls */}
          <div className="mb-8">
            <PlayerControls size="lg" />
          </div>

          {/* Volume Control Bar */}
          <div className="w-full max-w-xs flex items-center gap-3 pt-4 border-t border-purple-950/40">
            <button
              onClick={toggleMute}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-zinc-500" />
              ) : (
                <Volume2 className="w-4 h-4 text-purple-400" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolumeLevel(parseFloat(e.target.value))}
              aria-label="Volume slider"
              className="w-full h-1 bg-[#2D234D] rounded-full cursor-pointer accent-[#8B5CF6]"
            />
            <span className="text-[11px] font-mono text-zinc-400 w-8 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
        </div>

        {/* Right Column: Queue & Lyrics Tabs */}
        <div className="lg:col-span-5 bg-[#1B1C2E]/80 border border-purple-900/40 rounded-3xl p-6 shadow-2xl flex flex-col h-[580px]">
          {/* Segmented Control */}
          <div className="flex items-center gap-2 border-b border-purple-900/30 pb-3 mb-4">
            <button
              onClick={() => setActiveTab('queue')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'queue'
                  ? 'bg-[#8B5CF6] text-white shadow-md shadow-purple-600/25'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ListMusic className="w-4 h-4" />
              <span>Playing Queue ({queue.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('lyrics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'lyrics'
                  ? 'bg-[#8B5CF6] text-white shadow-md shadow-purple-600/25'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Mic2 className="w-4 h-4" />
              <span>Lyrics</span>
            </button>

            {activeTab === 'queue' && (
              <button
                onClick={clearQueue}
                title="Clear queue"
                className="ml-auto text-zinc-400 hover:text-red-400 transition-colors p-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Queue Tab Content */}
          {activeTab === 'queue' ? (
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 divide-y divide-purple-950/30">
              {queue.map((song, idx) => {
                const isItemCurrent = song.id === currentSong.id;
                return (
                  <div
                    key={`${song.id}-${idx}`}
                    className={`flex items-center justify-between gap-3 p-2.5 rounded-xl transition-all group ${
                      isItemCurrent
                        ? 'bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-white'
                        : 'hover:bg-white/5 text-zinc-300'
                    }`}
                  >
                    <div
                      onClick={() => playSong(song)}
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    >
                      <img
                        src={song.artworkUrl}
                        alt={song.title}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">{song.title}</div>
                        <div className="text-[11px] text-zinc-400 truncate">
                          {song.artist} · <span className="text-purple-300">{song.language}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono text-zinc-400 tabular-nums">
                        {song.duration}
                      </span>
                      <button
                        onClick={() => removeFromQueue(idx)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-400 transition-all cursor-pointer"
                        title="Remove from queue"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Lyrics Tab Content */
            <div className="flex-1 overflow-y-auto p-4 bg-[#141524] rounded-2xl border border-purple-950/40 text-center flex flex-col justify-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3">
                {currentSong.title} — Lyrics
              </h4>
              <p className="text-sm sm:text-base text-zinc-200 leading-loose whitespace-pre-line font-medium">
                {currentSong.lyrics || "No lyrics available for this track."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
