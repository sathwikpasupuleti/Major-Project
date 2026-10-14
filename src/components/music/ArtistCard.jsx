import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Plus } from 'lucide-react';

export default function ArtistCard({ artist }) {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="group relative bg-[#1B1C2E] rounded-xl p-4 border border-purple-900/30 hover:border-purple-600/50 hover:bg-[#202237] transition-all flex flex-col items-center text-center">
      {/* Circular Avatar */}
      <div className="relative w-28 h-28 rounded-full overflow-hidden mb-3 bg-[#131422] ring-2 ring-purple-900/40 group-hover:ring-[#8B5CF6] transition-all shadow-lg">
        <img
          src={artist.imageUrl}
          alt={artist.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <Link
        to={`/artists/${artist.id}`}
        className="text-sm font-bold text-white hover:text-[#8B5CF6] transition-colors truncate w-full"
      >
        {artist.name}
      </Link>

      <span className="text-[11px] text-zinc-400 mt-1">
        {artist.languages.join(' · ')}
      </span>

      <span className="text-[11px] text-zinc-500 mt-0.5">
        {artist.monthlyListeners} listeners
      </span>

      <button
        onClick={() => setIsFollowing(prev => !prev)}
        className={`mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
          isFollowing
            ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
            : 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-sm'
        }`}
      >
        {isFollowing ? (
          <>
            <Check className="w-3.5 h-3.5 text-purple-400" />
            <span>Following</span>
          </>
        ) : (
          <>
            <Plus className="w-3.5 h-3.5" />
            <span>Follow</span>
          </>
        )}
      </button>
    </div>
  );
}
