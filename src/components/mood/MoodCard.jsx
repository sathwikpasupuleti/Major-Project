import React from 'react';
import { Smile, CloudRain, Coffee, Brain, Zap, Heart, Play } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { SONGS } from '../../data/mockData';

const MOOD_ICONS = {
  Smile: Smile,
  CloudRain: CloudRain,
  Coffee: Coffee,
  Brain: Brain,
  Zap: Zap,
  Heart: Heart,
};

export default function MoodCard({ mood }) {
  const navigate = useNavigate();
  const { playSong } = useMusicPlayer();
  const IconComponent = MOOD_ICONS[mood.icon] || Smile;

  const handleQuickPlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const moodSongs = SONGS.filter(s => s.mood.toLowerCase() === mood.name.toLowerCase());
    if (moodSongs.length > 0) {
      playSong(moodSongs[0], moodSongs);
    }
  };

  return (
    <div
      onClick={() => navigate(`/mood-discovery?mood=${mood.name.toLowerCase()}`)}
      className={`group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${mood.colorFrom} ${mood.colorTo} bg-[#1B1C2E] border ${mood.borderColor} hover:border-[#8B5CF6] transition-all duration-300 hover:scale-[1.02] cursor-pointer flex flex-col justify-between min-h-[150px] shadow-lg`}
    >
      {/* Background ambient shape */}
      <div
        className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-20 blur-xl pointer-events-none"
        style={{ backgroundColor: mood.accentColor }}
      />

      <div className="flex items-start justify-between relative z-10">
        <div className="p-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white">
          <IconComponent className="w-5 h-5" style={{ color: mood.accentColor }} />
        </div>
        <button
          onClick={handleQuickPlay}
          aria-label={`Play ${mood.name} mix`}
          className="w-9 h-9 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md shadow-purple-600/30 hover:scale-110 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current ml-0.5" />
        </button>
      </div>

      <div className="relative z-10 mt-4">
        <h3 className="text-lg font-bold text-white group-hover:text-purple-200 transition-colors">
          {mood.name}
        </h3>
        <p className="text-xs text-zinc-300/90 mt-1 line-clamp-1">
          {mood.tagline}
        </p>
        <span className="inline-block text-[11px] text-zinc-400 mt-2 font-medium">
          {mood.songCount} Curated Tracks
        </span>
      </div>
    </div>
  );
}
