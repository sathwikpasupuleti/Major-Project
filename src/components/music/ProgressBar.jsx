import React from 'react';

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds === null) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function ProgressBar({
  currentTime = 0,
  duration = 0,
  onSeek,
  className = '',
  showTimes = true,
  size = 'md',
}) {
  const safeCurrentTime = Math.min(Math.max(0, currentTime), duration || 0);
  const percentage = duration > 0 ? (safeCurrentTime / duration) * 100 : 0;

  const handleChange = (e) => {
    const newTime = parseFloat(e.target.value);
    if (onSeek) onSeek(newTime);
  };

  return (
    <div className={`flex items-center gap-2.5 w-full ${className}`}>
      {showTimes && (
        <span className="text-[11px] font-mono text-zinc-400 tabular-nums shrink-0 w-9 text-right">
          {formatTime(safeCurrentTime)}
        </span>
      )}

      <div className="relative flex-1 flex items-center group py-1">
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="1"
          value={safeCurrentTime}
          onChange={handleChange}
          aria-label="Seek track position"
          className="w-full h-1 bg-[#2D234D] rounded-full appearance-none cursor-pointer focus:outline-none"
        />
        {/* Glow fill overlay for visual polish */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] rounded-full pointer-events-none transition-all group-hover:bg-[#A855F7]"
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>

      {showTimes && (
        <span className="text-[11px] font-mono text-zinc-400 tabular-nums shrink-0 w-9 text-left">
          {formatTime(duration)}
        </span>
      )}
    </div>
  );
}
