
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Pause,
  Shuffle,
  Edit2,
  Trash2,
  Plus,
  ArrowLeft,
  Clock,
  ListMusic,
  X,
} from 'lucide-react';

import { useMusicPlayer } from '../context/MusicPlayerContext';
import SongRow from '../components/music/SongRow';
import EmptyState from '../components/common/EmptyState';

export default function PlaylistDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    songsList = [],
    currentSong,
    isPlaying,
    togglePlay,
    isLoadingSongs = false,
    songLoadError = '',
    playlists = [],
    updatePlaylist,
    deletePlaylist,
    removeSongFromPlaylist,
    addSongToPlaylist,
    playSong,
  } = useMusicPlayer();

  const playlist = playlists.find(
    (item) => String(item.id) === String(id)
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [songSearchQuery, setSongSearchQuery] = useState('');

  useEffect(() => {
    setEditName(playlist?.name || '');
    setEditDesc(playlist?.description || '');
  }, [playlist?.id, playlist?.name, playlist?.description]);

  const playlistSongIds = useMemo(
    () => (playlist?.songIds || []).map(String),
    [playlist?.songIds]
  );

  const playlistSongs = useMemo(
    () =>
      playlistSongIds
        .map((songId) =>
          songsList.find(
            (song) => String(song.id) === songId
          )
        )
        .filter(Boolean),
    [playlistSongIds, songsList]
  );

  const isPlaylistSongPlaying =
    Boolean(isPlaying) &&
    playlistSongs.some(
      (song) => String(song.id) === String(currentSong?.id)
    );

  const availableSongsToAdd = useMemo(() => {
    const query = songSearchQuery.trim().toLowerCase();

    return songsList.filter((song) => {
      const alreadyAdded = playlistSongIds.includes(
        String(song.id)
      );

      if (alreadyAdded) return false;
      if (!query) return true;

      return [
        song.title,
        song.artist_name,
        song.artist?.name,
        song.artist,
        song.language,
        song.album,
        song.genre,
        song.mood,
      ].some((value) =>
        String(value || '').toLowerCase().includes(query)
      );
    });
  }, [songsList, playlistSongIds, songSearchQuery]);

  const totalSeconds = playlistSongs.reduce(
    (total, song) =>
      total +
      Number(song.durationSec || song.duration_seconds || 0),
    0
  );

  const totalMins = Math.floor(totalSeconds / 60);

  const getArtwork = (song) =>
    song.artworkUrl ||
    song.artwork_url ||
    song.artwork ||
    '';

  const getArtist = (song) =>
    song.artist_name ||
    song.artist?.name ||
    song.artist ||
    'Unknown artist';

  if (!playlist) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <ListMusic className="w-14 h-14 text-purple-400 mb-4" />

        <h2 className="text-xl font-bold text-white">
          Playlist not found
        </h2>

        <p className="text-sm text-zinc-400 mt-2">
          This playlist may have been deleted or is no longer saved.
        </p>

        <Link
          to="/library"
          className="mt-5 px-4 py-2 rounded-xl bg-purple-600 text-white text-sm"
        >
          Back to Library
        </Link>
      </div>
    );
  }

  const handleSaveEdit = (event) => {
    event.preventDefault();

    if (!editName.trim()) return;

    updatePlaylist(playlist.id, {
      name: editName.trim(),
      description: editDesc.trim(),
    });

    setIsEditing(false);
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete playlist "${playlist.name}"?`
    );

    if (confirmed) {
      deletePlaylist(playlist.id);
      navigate('/library');
    }
  };

  // Synchronize the playlist button with the global audio player.
  const handlePlayAll = () => {
    if (playlistSongs.length === 0) return;

    if (isPlaylistSongPlaying) {
      togglePlay();
      return;
    }

    playSong(playlistSongs[0], playlistSongs);
  };

  const handleShuffle = () => {
    if (playlistSongs.length === 0) return;

    const shuffled = [...playlistSongs].sort(
      () => Math.random() - 0.5
    );

    playSong(shuffled[0], shuffled);
  };

  const handleAddSong = (songId) => {
    addSongToPlaylist(playlist.id, songId);
  };

  return (
    <div className="px-4 sm:px-8 py-6 max-w-7xl mx-auto space-y-8">
      <button
        onClick={() => navigate('/library')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Library
      </button>

      {/* Playlist banner */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end bg-gradient-to-b from-[#221C3E] via-[#1B1C2E] to-[#121320] p-6 sm:p-8 rounded-3xl border border-purple-800/40 shadow-2xl">
        <div className="md:col-span-4 lg:col-span-3">
          <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl ring-1 ring-purple-600/30 bg-[#151624] flex items-center justify-center">
            {playlist.coverUrl ? (
              <img
                src={playlist.coverUrl}
                alt={playlist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <ListMusic className="w-20 h-20 text-purple-400" />
            )}
          </div>
        </div>

        <div className="md:col-span-8 lg:col-span-9 space-y-4">
          <div className="text-xs uppercase font-bold tracking-wider text-purple-400">
            {playlist.isUserCreated
              ? 'Your Playlist'
              : 'Ragaa Playlist'}
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveEdit} className="space-y-3">
              <input
                type="text"
                value={editName}
                onChange={(event) =>
                  setEditName(event.target.value)
                }
                required
                className="w-full bg-[#10111B] border border-purple-600 rounded-xl px-4 py-2 text-2xl font-bold text-white focus:outline-none"
                placeholder="Playlist name"
              />

              <textarea
                value={editDesc}
                onChange={(event) =>
                  setEditDesc(event.target.value)
                }
                rows={2}
                className="w-full bg-[#10111B] border border-purple-900/60 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                placeholder="Playlist description"
              />

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white text-xs font-bold"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight break-words">
              {playlist.name}
            </h1>
          )}

          {!isEditing && (
            <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
              {playlist.description ||
                'Your personal music collection.'}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
            <span className="font-semibold text-white">
              {playlist.isUserCreated
                ? 'Created by You'
                : 'Ragaa Editorial'}
            </span>

            <span>·</span>
            <span>{playlistSongs.length} songs</span>
            <span>·</span>

            <span className="text-purple-300">
              {totalMins} minutes
            </span>
          </div>

          {/* Playlist actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handlePlayAll}
              disabled={playlistSongs.length === 0}
              aria-label={
                isPlaylistSongPlaying
                  ? 'Pause playlist'
                  : 'Play playlist'
              }
              className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-500 hover:to-fuchsia-400 text-white font-bold text-sm flex items-center gap-2.5 shadow-lg shadow-purple-600/30 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPlaylistSongPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 fill-current" />
              )}

              <span>
                {isPlaylistSongPlaying ? 'Pause' : 'Play'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleShuffle}
              disabled={playlistSongs.length === 0}
              className="px-5 py-3 rounded-full bg-[#1B1C2E] hover:bg-[#25273F] border border-purple-800/40 text-zinc-200 hover:text-white font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-40"
            >
              <Shuffle className="w-4 h-4" />
              <span>Shuffle</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddSongModal(true)}
              className="px-4 py-3 rounded-full bg-[#1B1C2E] hover:bg-[#25273F] border border-purple-800/40 text-purple-300 font-semibold text-xs flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Songs</span>
            </button>

            {playlist.isUserCreated && !isEditing && (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="p-3 rounded-full bg-[#1B1C2E] text-zinc-400 hover:text-white border border-purple-900/40 transition-colors"
                  title="Edit playlist"
                  aria-label="Edit playlist"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-3 rounded-full bg-[#1B1C2E] text-zinc-400 hover:text-red-400 border border-purple-900/40 transition-colors"
                  title="Delete playlist"
                  aria-label="Delete playlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Playlist tracks */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
          <h2 className="text-lg font-bold text-white">
            Tracks ({playlistSongs.length})
          </h2>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Clock className="w-4 h-4" />
            <span>Duration</span>
          </div>
        </div>

        {isLoadingSongs ? (
          <p className="py-8 text-center text-sm text-zinc-400">
            Loading songs...
          </p>
        ) : songLoadError ? (
          <p className="py-8 text-center text-sm text-amber-300">
            {songLoadError}
          </p>
        ) : playlistSongs.length === 0 ? (
          <EmptyState
            title="This playlist is empty"
            description="Add songs from your Django music library to start building this playlist."
            actionLabel="Add Songs Now"
            onAction={() => setShowAddSongModal(true)}
            icon={Plus}
          />
        ) : (
          <div className="bg-[#1B1C2E]/60 rounded-2xl p-2 border border-purple-900/30 divide-y divide-purple-950/40">
            {playlistSongs.map((song, index) => (
              <SongRow
                key={song.id}
                song={song}
                index={index}
                playlistId={playlist.id}
                onRemove={() =>
                  removeSongFromPlaylist(playlist.id, song.id)
                }
              />
            ))}
          </div>
        )}
      </section>

      {/* Add songs modal */}
      {showAddSongModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowAddSongModal(false);
            }
          }}
        >
          <div className="bg-[#1B1C2E] border border-purple-800/50 rounded-3xl p-5 sm:p-8 max-w-lg w-full shadow-2xl relative flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-purple-900/30">
              <h3 className="text-lg font-bold text-white">
                Add Songs to "{playlist.name}"
              </h3>

              <button
                type="button"
                onClick={() => setShowAddSongModal(false)}
                aria-label="Close add songs"
                className="p-1.5 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="pt-4 pb-2">
              <input
                type="text"
                value={songSearchQuery}
                onChange={(event) =>
                  setSongSearchQuery(event.target.value)
                }
                placeholder="Search songs by title, singer, language..."
                className="w-full bg-[#10111B] border border-purple-900/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-2 py-3">
              {isLoadingSongs ? (
                <p className="text-center py-8 text-sm text-zinc-400">
                  Loading songs from Django...
                </p>
              ) : songLoadError ? (
                <p className="text-center py-8 text-sm text-amber-300">
                  {songLoadError}
                </p>
              ) : availableSongsToAdd.length === 0 ? (
                <p className="text-center py-8 text-sm text-zinc-400">
                  {songsList.length === 0
                    ? 'No songs are available in your Django catalog.'
                    : 'No more matching songs to add.'}
                </p>
              ) : (
                availableSongsToAdd.map((song) => (
                  <div
                    key={song.id}
                    className="flex items-center justify-between gap-3 p-2 rounded-xl bg-[#141524] hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {getArtwork(song) ? (
                        <img
                          src={getArtwork(song)}
                          alt={song.title}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-purple-950 flex items-center justify-center shrink-0">
                          <ListMusic className="w-5 h-5 text-purple-300" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white truncate">
                          {song.title}
                        </div>

                        <div className="text-xs text-zinc-400 truncate">
                          {getArtist(song)} ·{' '}
                          <span className="text-purple-300">
                            {song.language || 'Unknown language'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddSong(song.id)}
                      className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-purple-900/30 flex items-center justify-between gap-3">
              <span className="text-xs text-zinc-400">
                {playlistSongs.length} songs in playlist
              </span>

              <button
                type="button"
                onClick={() => {
                  setShowAddSongModal(false);
                  setSongSearchQuery('');
                }}
                className="px-5 py-2 rounded-xl bg-zinc-800 text-white text-xs font-semibold hover:bg-zinc-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
