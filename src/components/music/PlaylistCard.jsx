
import React from 'react';
import { Play, ListMusic } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMusicPlayer } from '../../context/MusicPlayerContext';

export default function PlaylistCard({ playlist }) {
  const { playSong, songsList } = useMusicPlayer();

  const playlistSongIds = Array.isArray(playlist?.songIds)
    ? playlist.songIds
    : Array.isArray(playlist?.songs)
      ? playlist.songs.map((song) =>
          typeof song === 'object' ? song.id : song
        )
      : [];

  const playlistSongs = (songsList || []).filter((song) =>
    playlistSongIds.some(
      (id) => String(id) === String(song.id)
    )
  );

  const handlePlay = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (playlistSongs.length > 0) {
      playSong(playlistSongs[0], playlistSongs);
    }
  };

  return (
    <div className="group relative bg-[#1B1C2E] rounded-xl p-3 border border-purple-900/30 hover:border-purple-600/50 hover:bg-[#202237] transition-all flex flex-col">
      <Link
        to={`/playlists/${playlist.id}`}
        aria-label={`Open playlist ${playlist.name}`}
        className="block"
      >
        <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-3 bg-[#131422] flex items-center justify-center">
          {playlist.coverUrl || playlist.cover_url ? (
            <img
              src={playlist.coverUrl || playlist.cover_url}
              alt={playlist.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <ListMusic className="w-12 h-12 text-purple-400" />
          )}

          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/60 text-purple-200">
            Playlist
          </span>
        </div>

        <div className="text-sm font-semibold text-white truncate hover:text-[#8B5CF6]">
          {playlist.name}
        </div>

        <p className="text-xs text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed">
          {playlist.description || 'Your personal music collection'}
        </p>
      </Link>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-2 pt-2 border-t border-purple-950/40">
          <span>{playlistSongIds.length} songs</span>
          <span className="text-purple-300/70">
            {playlist.isUserCreated ? 'By You' : 'Ragaa Curated'}
          </span>
        </div>

        <button
          type="button"
          onClick={handlePlay}
          disabled={playlistSongs.length === 0}
          aria-label={`Play playlist ${playlist.name}`}
          title={
            playlistSongs.length === 0
              ? 'No playable songs in this playlist'
              : 'Play playlist'
          }
          className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold py-2 transition-colors"
        >
          <Play className="w-4 h-4 fill-current" />
          Play playlist
        </button>
      </div>
    </div>
  );
}
