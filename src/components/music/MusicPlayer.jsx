import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Volume2,
  VolumeX,
  ListMusic,
  Maximize2,
  Info,
  AlertCircle,
  X,
  Trash2,
} from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';

export default function MusicPlayer() {
  const {
    currentSong,
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
    removeFromQueue,
    clearQueue,
    playSong,
    audioError,
  } = useMusicPlayer();

  const [showQueueDrawer, setShowQueueDrawer] = useState(false);
  const liked = currentSong ? isLiked(currentSong.id) : false;

  if (!currentSong) return null;

  return (
    <>
      {/* Bottom Sticky Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#161726]/95 backdrop-blur-xl border-t border-purple-900/30 px-3 sm:px-6 py-2.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          {/* Left: Current Track Details - clicking opens Now Playing page */}
          <div className="flex items-center gap-3 min-w-0 w-1/3 sm:w-1/4">
            <Link
              to="/player"
              className="flex items-center gap-3 min-w-0 group cursor-pointer"
              title="Open Now Playing"
            >
              <div className="relative shrink-0">
                <img
                  src={currentSong.artworkUrl}
                  alt={currentSong.title}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-lg object-cover ring-1 ring-purple-900/40 group-hover:ring-[#8B5CF6] transition-all"
                />
                <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              <div className="min-w-0">
                <div className="block text-xs sm:text-sm font-bold text-white truncate group-hover:text-[#8B5CF6] transition-colors">
                  {currentSong.title}
                </div>
                <div className="block text-[11px] text-zinc-400 truncate group-hover:text-zinc-200 transition-colors">
                  {currentSong.artist}
                </div>
              </div>
            </Link>

            <button
              onClick={() => toggleLike(currentSong.id)}
              className="p-1.5 text-zinc-400 hover:text-pink-500 transition-colors cursor-pointer shrink-0 hidden sm:block"
              aria-label={liked ? 'Unlike' : 'Like'}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-pink-500 text-pink-500' : ''}`} />
            </button>
          </div>

          {/* Center: Controls & Progress Bar */}
          <div className="flex-1 max-w-xl flex flex-col items-center gap-1">
            <PlayerControls size="md" />
            <div className="w-full hidden sm:block">
              <ProgressBar
                currentTime={currentTime}
                duration={duration}
                onSeek={seekTo}
              />
            </div>
          </div>

          {/* Right: Volume, Queue, Expand */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 w-1/4 sm:w-1/4 shrink-0">
            {/* Audio error display */}
            {audioError && (
              <div
                title={audioError}
                className="flex items-center text-[10px] text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/60 max-w-[150px] truncate"
              >
                <AlertCircle className="w-3 h-3 mr-1 text-rose-400 shrink-0" />
                <span className="truncate">{audioError}</span>
              </div>
            )}

            {/* Volume Control */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
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
                className="w-18 h-1 bg-[#2D234D] rounded-full cursor-pointer accent-[#8B5CF6]"
              />
            </div>

            {/* Queue Toggle */}
            <button
              onClick={() => setShowQueueDrawer(prev => !prev)}
              className={`p-2 rounded-lg transition-colors cursor-pointer relative ${
                showQueueDrawer
                  ? 'bg-[#8B5CF6]/20 text-[#8B5CF6]'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Current playback queue"
              aria-label="Toggle queue"
            >
              <ListMusic className="w-4 h-4" />
              {queue.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8B5CF6] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {queue.length}
                </span>
              )}
            </button>

            {/* Fullscreen Player Page Link */}
            <Link
              to="/player"
              className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer hidden sm:block"
              title="Open full player view"
              aria-label="Open full player view"
            >
              <Maximize2 className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Mobile-only slim progress bar */}
        <div className="block sm:hidden w-full pt-1.5">
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={seekTo}
            showTimes={false}
          />
        </div>
      </div>

      {/* Floating Queue Drawer */}
      {showQueueDrawer && (
        <div className="fixed bottom-20 right-4 z-50 w-80 sm:w-96 max-h-[460px] bg-[#1B1C2E] border border-purple-900/50 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="px-4 py-3 border-b border-purple-900/30 flex items-center justify-between bg-[#151624]">
            <div className="flex items-center gap-2">
              <ListMusic className="w-4 h-4 text-[#8B5CF6]" />
              <h4 className="text-sm font-bold text-white">Up Next</h4>
              <span className="text-xs text-zinc-400">({queue.length})</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearQueue}
                title="Clear queue"
                className="p-1 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowQueueDrawer(false)}
                className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 divide-y divide-purple-950/30">
            {queue.map((song, idx) => {
              const isCurrentInQueue = song.id === currentSong?.id;
              return (
                <div
                  key={`${song.id}-${idx}`}
                  className={`flex items-center justify-between gap-2 p-2 rounded-lg transition-colors group ${
                    isCurrentInQueue
                      ? 'bg-[#8B5CF6]/20 text-white font-medium'
                      : 'hover:bg-white/5 text-zinc-300'
                  }`}
                >
                  <div
                    onClick={() => playSong(song)}
                    className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                  >
                    <img
                      src={song.artworkUrl}
                      alt={song.title}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs truncate font-medium">{song.title}</div>
                      <div className="text-[11px] text-zinc-400 truncate">{song.artist}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-mono text-zinc-500 tabular-nums">
                      {song.duration}
                    </span>
                    <button
                      onClick={() => removeFromQueue(idx)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 transition-opacity cursor-pointer"
                      title="Remove from queue"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
