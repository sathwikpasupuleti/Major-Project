import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';

export default function PlayerControls({ size = 'md', className = '' }) {
  const {
    isPlaying,
    togglePlay,
    nextSong,
    prevSong,
    isShuffle,
    toggleShuffle,
    repeatMode,
    cycleRepeatMode,
  } = useMusicPlayer();

  const isLarge = size === 'lg';

  return (
    <div className={`flex items-center gap-3 sm:gap-4 ${className}`}>
      {/* Shuffle Button */}
      <button
        onClick={toggleShuffle}
        title={isShuffle ? 'Disable shuffle' : 'Enable shuffle'}
        className={`p-2 rounded-lg transition-colors cursor-pointer ${
          isShuffle ? 'text-[#8B5CF6] hover:text-[#A855F7]' : 'text-zinc-400 hover:text-white'
        }`}
        aria-label="Toggle shuffle"
      >
        <Shuffle className="w-4 h-4" />
      </button>

      {/* Previous Song */}
      <button
        onClick={prevSong}
        title="Previous track"
        className="p-2 text-zinc-300 hover:text-white transition-colors cursor-pointer"
        aria-label="Previous track"
      >
        <SkipBack className={isLarge ? 'w-6 h-6' : 'w-5 h-5'} />
      </button>

      {/* Play / Pause Primary Button */}
      <button
        onClick={togglePlay}
        title={isPlaying ? 'Pause' : 'Play'}
        className={`rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-600/30 cursor-pointer ${
          isLarge ? 'w-14 h-14' : 'w-10 h-10'
        }`}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className={isLarge ? 'w-6 h-6 fill-current' : 'w-4 h-4 fill-current'} />
        ) : (
          <Play className={isLarge ? 'w-6 h-6 fill-current ml-1' : 'w-4 h-4 fill-current ml-0.5'} />
        )}
      </button>

      {/* Next Song */}
      <button
        onClick={nextSong}
        title="Next track"
        className="p-2 text-zinc-300 hover:text-white transition-colors cursor-pointer"
        aria-label="Next track"
      >
        <SkipForward className={isLarge ? 'w-6 h-6' : 'w-5 h-5'} />
      </button>

      {/* Repeat Mode */}
      <button
        onClick={cycleRepeatMode}
        title={`Repeat: ${repeatMode}`}
        className={`p-2 rounded-lg transition-colors cursor-pointer ${
          repeatMode !== 'off'
            ? 'text-[#8B5CF6] hover:text-[#A855F7]'
            : 'text-zinc-400 hover:text-white'
        }`}
        aria-label="Toggle repeat"
      >
        {repeatMode === 'one' ? (
          <Repeat1 className="w-4 h-4" />
        ) : (
          <Repeat className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
