
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  ListMusic,
  Disc,
  Clock,
  Plus,
} from 'lucide-react';

import { useMusicPlayer } from '../context/MusicPlayerContext';
import { apiService } from '../services/apiService';
import SongRow from '../components/music/SongRow';
import AlbumCard from '../components/music/AlbumCard';
import PlaylistCard from '../components/music/PlaylistCard';

export default function LibraryPage() {
  const {
    songsList = [],
    playlists = [],
    likedSongIds = [],
    history = [],
    createPlaylist,
  } = useMusicPlayer();

  const [activeTab, setActiveTab] = useState('playlists');
  const [albums, setAlbums] = useState([]);
  const [loadingAlbums, setLoadingAlbums] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');

  // Display only playlists created by the user.
  const userPlaylists = playlists.filter(
    (playlist) => playlist.isUserCreated === true
  );

  useEffect(() => {
    let active = true;

    async function loadAlbums() {
      try {
        const response = await apiService.getAlbums();

        if (!active) return;

        setAlbums(
          Array.isArray(response)
            ? response
            : response?.results || []
        );
      } catch (error) {
        console.error('Failed to load Django albums:', error);
        if (active) setAlbums([]);
      } finally {
        if (active) setLoadingAlbums(false);
      }
    }

    loadAlbums();

    return () => {
      active = false;
    };
  }, []);

  const likedSongs = songsList.filter((song) =>
    likedSongIds.some(
      (id) => String(id) === String(song.id)
    )
  );

  const recentSongs = history
    .map((item) => {
      const songId = item.songId ?? item.song?.id;

      const song = songsList.find(
        (entry) => String(entry.id) === String(songId)
      );

      return song
        ? { song, playedAt: item.playedAt }
        : null;
    })
    .filter(Boolean)
    .filter(
      (item, index, array) =>
        array.findIndex(
          (other) =>
            String(other.song.id) === String(item.song.id)
        ) === index
    );

  const handleCreatePlaylist = (event) => {
    event.preventDefault();

    if (!playlistName.trim()) return;

    createPlaylist({
      name: playlistName.trim(),
      description: playlistDescription.trim(),
      songIds: [],
      isUserCreated: true,
    });

    setPlaylistName('');
    setPlaylistDescription('');
    setShowCreateForm(false);
    setActiveTab('playlists');
  };

  const tabs = [
    {
      id: 'liked',
      label: 'Liked Songs',
      count: likedSongs.length,
      Icon: Heart,
    },
    {
      id: 'playlists',
      label: 'Playlists',
      count: userPlaylists.length,
      Icon: ListMusic,
    },
    {
      id: 'albums',
      label: 'Saved Albums',
      count: albums.length,
      Icon: Disc,
    },
    {
      id: 'recent',
      label: 'Recently Played',
      count: recentSongs.length,
      Icon: Clock,
    },
  ];

  return (
    <main className="px-4 sm:px-8 py-6 max-w-7xl mx-auto space-y-6 text-white">
      <Link
        to="/home"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-700/40 bg-purple-950/60 px-3 py-1 text-xs text-purple-300">
            <ListMusic className="w-4 h-4" />
            Personal Audio Hub
          </div>

          <h1 className="mt-3 text-3xl font-extrabold">
            My Library
          </h1>

          <p className="mt-1 text-sm text-zinc-400">
            Access your liked tracks, saved albums, playlists, and listening history.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateForm((value) => !value)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-3 text-sm font-bold"
        >
          <Plus className="w-4 h-4" />
          New Playlist
        </button>
      </header>

      {showCreateForm && (
        <form
          onSubmit={handleCreatePlaylist}
          className="rounded-2xl border border-purple-900/40 bg-[#1B1C2E] p-5 space-y-3"
        >
          <h2 className="font-bold">Create a playlist</h2>

          <input
            required
            value={playlistName}
            onChange={(event) => setPlaylistName(event.target.value)}
            placeholder="Playlist name"
            className="w-full rounded-xl bg-[#10111B] border border-purple-900/40 px-4 py-3 text-sm outline-none focus:border-purple-500"
          />

          <textarea
            value={playlistDescription}
            onChange={(event) => setPlaylistDescription(event.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="w-full rounded-xl bg-[#10111B] border border-purple-900/40 px-4 py-3 text-sm outline-none focus:border-purple-500"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold"
            >
              Create
            </button>

            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="rounded-lg bg-zinc-800 px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <nav className="flex flex-wrap gap-2 border-b border-purple-900/30 pb-3">
        {tabs.map(({ id, label, count, Icon }) => (
          <button
            type="button"
            key={id}
            onClick={() => setActiveTab(id)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === id
                ? 'bg-purple-600 text-white'
                : 'text-zinc-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            <span className="text-xs opacity-70">({count})</span>
          </button>
        ))}
      </nav>

      {activeTab === 'playlists' && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold">
            Your Playlists ({userPlaylists.length})
          </h2>

          {userPlaylists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {userPlaylists.map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                />
              ))}
            </div>
          ) : (
            <EmptyMessage
              title="No playlists yet"
              description="Create your own playlist to collect your favourite songs."
            />
          )}
        </section>
      )}

      {activeTab === 'liked' && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold">
            Liked Songs ({likedSongs.length})
          </h2>

          {likedSongs.length > 0 ? (
            <div className="rounded-2xl border border-purple-900/30 bg-[#1B1C2E]/60 p-2 divide-y divide-purple-950/40">
              {likedSongs.map((song, index) => (
                <SongRow key={song.id} song={song} index={index} />
              ))}
            </div>
          ) : (
            <EmptyMessage
              title="No liked songs"
              description="Like a song to find it here."
            />
          )}
        </section>
      )}

      {activeTab === 'albums' && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold">
            Albums ({albums.length})
          </h2>

          {loadingAlbums ? (
            <p className="text-sm text-zinc-400">Loading albums...</p>
          ) : albums.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {albums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          ) : (
            <EmptyMessage
              title="No albums available"
              description="Add albums through Django Admin to display them here."
            />
          )}
        </section>
      )}

      {activeTab === 'recent' && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold">
            Recently Played ({recentSongs.length})
          </h2>

          {recentSongs.length > 0 ? (
            <div className="rounded-2xl border border-purple-900/30 bg-[#1B1C2E]/60 p-2 divide-y divide-purple-950/40">
              {recentSongs.map((item, index) => (
                <SongRow
                  key={`${item.song.id}-${index}`}
                  song={item.song}
                  index={index}
                  playedAt={item.playedAt || null}
                />
              ))}
            </div>
          ) : (
            <EmptyMessage
              title="Nothing played recently"
              description="Play a song and it will appear here."
            />
          )}
        </section>
      )}
    </main>
  );
}

function EmptyMessage({ title, description }) {
  return (
    <div className="rounded-2xl border border-purple-900/30 bg-[#1B1C2E]/60 p-8 text-center">
      <ListMusic className="w-9 h-9 text-purple-400 mx-auto mb-3" />
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-zinc-400">{description}</p>
    </div>
  );
}
