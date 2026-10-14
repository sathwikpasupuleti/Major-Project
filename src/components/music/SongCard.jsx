
import React from 'react';
import { Play, Pause, Heart } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useMusicPlayer } from '../../context/MusicPlayerContext';

export default function SongCard({ song, showMood = false }) {
  const navigate = useNavigate();

  const {
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
    toggleLike,
    isLiked,
  } = useMusicPlayer();

  const isCurrent = String(currentSong?.id) === String(song.id);
  const isThisPlaying = isCurrent && isPlaying;
  const liked = isLiked(song.id);

  const openSongDetails = () => {
    navigate(`/songs/${encodeURIComponent(song.id)}`, {
      state: { song },
    });
  };

  const handlePlayClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song);
    }
  };

  const handleLikeClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleLike(song.id);
  };

  return (
    <div className="group relative bg-[#1B1C2E] rounded-xl p-3 border border-purple-900/30 hover:border-purple-600/50 hover:bg-[#202237] transition-all flex flex-col">
      <div
        onDoubleClick={openSongDetails}
        className="relative aspect-square w-full rounded-lg overflow-hidden mb-3 bg-[#131422]"
      >
        <button
          type="button"
          onClick={openSongDetails}
          className="w-full h-full"
          aria-label={`View details for ${song.title}`}
        >
          <img
            src={song.artworkUrl || song.artwork || ''}
            alt={song.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </button>

        <button
          type="button"
          onClick={handlePlayClick}
          aria-label={isThisPlaying ? 'Pause song' : 'Play song'}
          className={`absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full flex items-center justify-center bg-[#8B5CF6] text-white shadow-lg ${
            isThisPlaying
              ? 'opacity-100'
              : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          {isThisPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        <button
          type="button"
          onClick={handleLikeClick}
          aria-label={liked ? 'Unlike song' : 'Like song'}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md ${
            liked
              ? 'text-pink-500 bg-black/40'
              : 'text-white/70 bg-black/40 opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              liked ? 'fill-pink-500 text-pink-500' : ''
            }`}
          />
        </button>

        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/60 text-purple-200 pointer-events-none">
          {song.language || ''}
        </span>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <button
          type="button"
          onClick={openSongDetails}
          className={`text-sm font-semibold truncate text-left hover:text-[#8B5CF6] ${
            isCurrent ? 'text-[#8B5CF6]' : 'text-white'
          }`}
        >
          {song.title}
        </button>

        <div className="text-xs text-zinc-400 truncate mt-0.5">
          {song.artist || song.artist_name || ''}
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-2 pt-2 border-t border-purple-950/40">
          <span>{song.duration || '—'}</span>
          <span className="text-purple-400/80 font-medium">
            {song.genre || ''}
          </span>
        </div>
      </div>
    </div>
  );
}
