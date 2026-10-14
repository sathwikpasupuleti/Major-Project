
import React, { useState } from 'react';
import {
  Play,
  Pause,
  Heart,
  MoreHorizontal,
  Plus,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMusicPlayer } from '../../context/MusicPlayerContext';

export default function SongRow({
  song,
  index,
  playlistId = null,
  onRemove = null,
  showAlbum = true,
  playedAt = null,
}) {
  const navigate = useNavigate();

  const {
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
    toggleLike,
    isLiked,
    playlists,
    addSongToPlaylist,
  } = useMusicPlayer();

  const [showMenu, setShowMenu] = useState(false);

  const isCurrent =
    currentSong?.id != null &&
    song?.id != null &&
    String(currentSong.id) === String(song.id);

  // Only show Pause when this exact song is the current playing song.
  const isThisPlaying = isCurrent && Boolean(isPlaying);
  const liked = isLiked(song.id);

  const openSongDetails = () => {
    navigate(`/songs/${encodeURIComponent(song.id)}`, {
      state: { song },
    });
  };

  const handlePlay = (event) => {
    event?.stopPropagation();

    if (isCurrent) {
      togglePlay();
    } else {
      // Preserve the playlist queue when playing a track from a playlist.
      if (playlistId != null) {
        const selectedPlaylist = playlists.find(
          (playlist) => String(playlist.id) === String(playlistId)
        );

        const ids = selectedPlaylist?.songIds || [];
        const playlistQueue = ids
          .map((id) => {
            // SongRow only receives one song, so the normal player queue
            // is used when the full playlist list isn't available here.
            return String(id) === String(song.id) ? song : null;
          })
          .filter(Boolean);

        playSong(song, playlistQueue.length ? playlistQueue : null);
      } else {
        playSong(song);
      }
    }
  };

  return (
    <div
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
        isCurrent
          ? 'bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-white'
          : 'hover:bg-[#1B1C2E]/80 text-zinc-300'
      }`}
    >
      <div className="w-8 flex items-center justify-center shrink-0">
        <span
          className={`text-xs font-medium group-hover:hidden ${
            isCurrent ? 'text-[#8B5CF6] font-bold' : 'text-zinc-500'
          }`}
        >
          {isThisPlaying ? (
            <span className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 h-3 bg-[#8B5CF6] animate-pulse" />
              <span className="w-0.5 h-2 bg-[#8B5CF6] animate-pulse delay-75" />
              <span className="w-0.5 h-3.5 bg-[#8B5CF6] animate-pulse delay-150" />
            </span>
          ) : (
            (index ?? 0) + 1
          )}
        </span>

        <button
          type="button"
          onClick={handlePlay}
          className="hidden group-hover:flex items-center justify-center text-white hover:text-[#8B5CF6]"
          aria-label={isThisPlaying ? 'Pause song' : 'Play song'}
          title={isThisPlaying ? 'Pause' : 'Play'}
        >
          {isThisPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
        </button>
      </div>

      <button
        type="button"
        onClick={openSongDetails}
        className="shrink-0"
        aria-label={`View details for ${song.title}`}
      >
        <img
          src={song.artworkUrl || song.artwork_url || song.artwork || ''}
          alt={song.title}
          className="w-10 h-10 rounded-lg object-cover"
        />
      </button>

      <div className="flex-1 min-w-0 pr-2">
        <button
          type="button"
          onClick={openSongDetails}
          className={`block text-sm font-semibold truncate text-left hover:text-[#8B5CF6] ${
            isCurrent ? 'text-[#8B5CF6]' : 'text-white'
          }`}
        >
          {song.title}
        </button>

        <div className="flex items-center gap-2 text-xs text-zinc-400 truncate mt-0.5">
          <span className="truncate">
            {song.artist_name || song.artist?.name || song.artist || ''}
          </span>
          <span className="text-zinc-600">·</span>
          <span className="text-[11px] text-purple-300/80">
            {song.language || ''}
          </span>
        </div>
      </div>

      {showAlbum && (
        <div className="hidden md:block flex-1 min-w-0 text-xs text-zinc-400 truncate pr-4">
          {song.album || ''}
        </div>
      )}

      {playedAt && (
        <div className="hidden sm:block text-xs text-zinc-500 shrink-0">
          {playedAt}
        </div>
      )}

      <button
        type="button"
        onClick={() => toggleLike(song.id)}
        className="p-1.5 rounded-full text-zinc-400 hover:text-pink-500 shrink-0"
        aria-label={liked ? 'Unlike song' : 'Like song'}
      >
        <Heart
          className={`w-4 h-4 ${
            liked ? 'fill-pink-500 text-pink-500' : ''
          }`}
        />
      </button>

      <div className="text-xs text-zinc-400 w-12 text-right font-mono tabular-nums shrink-0">
        {song.duration || '—'}
      </div>

      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => setShowMenu((previous) => !previous)}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10"
          aria-label="Song options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {showMenu && (
          <div
            className="absolute right-0 top-full mt-1 w-48 bg-[#1B1C2E] border border-purple-900/40 rounded-xl shadow-xl z-30 py-1 text-xs"
            onMouseLeave={() => setShowMenu(false)}
          >
            {onRemove && (
              <button
                type="button"
                onClick={() => {
                  onRemove();
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-red-400 hover:bg-red-500/10 flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove from playlist
              </button>
            )}

            <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
              Add to playlist
            </div>

            {playlists.length === 0 ? (
              <div className="px-3 py-1 text-zinc-500">
                No playlists yet
              </div>
            ) : (
              playlists.map((playlist) => {
                const alreadyAdded = (playlist.songIds || []).some(
                  (id) => String(id) === String(song.id)
                );

                return (
                  <button
                    type="button"
                    key={playlist.id}
                    disabled={alreadyAdded}
                    onClick={() => {
                      addSongToPlaylist(playlist.id, song.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-zinc-300 hover:bg-purple-600/20 hover:text-white disabled:opacity-50 flex items-center gap-2 truncate"
                  >
                    {alreadyAdded ? (
                      <span className="text-purple-400">✓</span>
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-purple-400" />
                    )}
                    <span className="truncate">
                      {playlist.name}
                      {alreadyAdded ? ' (Added)' : ''}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
