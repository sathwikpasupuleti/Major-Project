
import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'https://ragaa-music-app-2026.onrender.com';

export default function ArtistCard({ artist }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();

  if (!artist) return null;

  const name = artist.name || 'Unknown Artist';
  const artistId = artist.id;

  const rawImage = artist.image || artist.image_url || artist.imageUrl || '';
  const imageUrl = rawImage
    ? rawImage.startsWith('http')
      ? rawImage
      : `${API_BASE}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`
    : '';

  const handleFollow = (event) => {
    event.stopPropagation();
    setIsFollowing((previous) => !previous);
  };

  const handleArtistClick = () => {
    if (artistId !== undefined && artistId !== null) {
      navigate(`/artists/${artistId}`);
    }
  };

  return (
    <article
      onClick={handleArtistClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter') handleArtistClick();
      }}
      role="link"
      tabIndex={0}
      className="
        w-full min-w-0
        rounded-2xl
        border border-purple-900/40
        bg-[#1B1C2E]
        p-4 sm:p-5
        flex flex-col items-center text-center
        transition-all duration-200
        hover:border-purple-500/70
        hover:bg-[#22233A]
        cursor-pointer
      "
    >
      {/* Artist image */}
      <div className="
        w-28 h-28 sm:w-36 sm:h-36
        shrink-0 overflow-hidden rounded-full
        border-2 border-purple-500/70
        bg-[#121320]
        mb-4
      ">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="
            w-full h-full flex items-center justify-center
            text-4xl font-bold text-purple-400
          ">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Artist name */}
      <h3
        className="w-full truncate text-base sm:text-lg font-bold text-white"
        title={name}
      >
        {name}
      </h3>

      {/* Listeners */}
      <p className="mt-2 text-sm text-zinc-500">
        {artist.monthly_listeners
          ? `${Number(artist.monthly_listeners).toLocaleString()} listeners`
          : artist.monthlyListeners
            ? `${Number(artist.monthlyListeners).toLocaleString()} listeners`
            : 'Artist'}
      </p>

      {/* Follow button */}
      <button
        type="button"
        onClick={handleFollow}
        className="
          mt-5 w-full rounded-xl
          px-3 py-2.5
          bg-[#8B5CF6] hover:bg-[#7C3AED]
          text-white font-semibold
          flex items-center justify-center gap-2
          transition-colors
        "
      >
        {isFollowing ? (
          <>
            <Check className="w-4 h-4" />
            Following
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            Follow
          </>
        )}
      </button>
    </article>
  );
}
