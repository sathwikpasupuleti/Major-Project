import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Pause,
  Shuffle,
  Heart,
  ArrowLeft,
  Clock,
} from 'lucide-react';

import { useMusicPlayer } from '../context/MusicPlayerContext';
import { apiService } from '../services/apiService';
import SongRow from '../components/music/SongRow';

export default function AlbumDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    playSong,
    currentSong,
    isPlaying,
    togglePlay,
  } = useMusicPlayer();

  const [album, setAlbum] = useState(null);
  const [albumSongs, setAlbumSongs] = useState([]);
  const [albumLiked, setAlbumLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadAlbum() {
      setLoading(true);
      setError('');

      try {
        const [albumsData, songsData] = await Promise.all([
          apiService.getAlbums(),
          apiService.getSongs(),
        ]);

        if (!isMounted) return;

        const albums = Array.isArray(albumsData) ? albumsData : [];
        const songs = Array.isArray(songsData) ? songsData : [];

        const selectedAlbum = albums.find(
          (item) => String(item.id) === String(id)
        );

        if (!selectedAlbum) {
          setAlbum(null);
          setAlbumSongs([]);
          setError('Album not found.');
          return;
        }

        const linkedSongs = songs.filter((song) => {
          const record = song.album_record;
          const recordId =
            record && typeof record === 'object'
              ? record.id
              : record;

          if (
            recordId !== null &&
            recordId !== undefined &&
            recordId !== ''
          ) {
            return String(recordId) === String(selectedAlbum.id);
          }

          return (
            typeof song.album === 'string' &&
            song.album.trim().toLowerCase() ===
              selectedAlbum.title.trim().toLowerCase()
          );
        });

        setAlbum(selectedAlbum);
        setAlbumSongs(linkedSongs);
      } catch (err) {
        console.error('Failed to load album:', err);

        if (isMounted) {
          setError(
            'Unable to load this album. Check that Django is running.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadAlbum();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const apiBase = (
    import.meta.env.VITE_API_BASE_URL ||
    'http://127.0.0.1:8000/api'
  ).replace(/\/api\/?$/, '');

  const artwork = album?.artworkUrl || album?.artwork || '';

  const artworkUrl = artwork
    ? /^https?:\/\//i.test(artwork)
      ? artwork
      : `${apiBase}/${artwork.replace(/^\/+/, '')}`
    : '';

  const artistName =
    album?.artist_name ||
    (typeof album?.artist === 'object' ? album.artist?.name : '') ||
    album?.artist ||
    'Unknown Artist';

  const artistId =
    typeof album?.artist === 'object'
      ? album.artist?.id
      : album?.artist;

  const totalDurationSeconds = albumSongs.reduce(
    (total, song) =>
      total + Number(song.duration_seconds || song.durationSec || 0),
    0
  );

  const totalMins = Math.floor(totalDurationSeconds / 60);

  const isAlbumPlaying = Boolean(
    albumSongs.length > 0 &&
    isPlaying &&
    currentSong &&
    albumSongs.some(
      (song) => String(song.id) === String(currentSong.id)
    )
  );

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handlePlayAlbum = () => {
    if (albumSongs.length === 0) return;

    if (isAlbumPlaying) {
      togglePlay();
      return;
    }

    playSong(albumSongs[0], albumSongs);
  };

  const handleShuffleAlbum = () => {
    if (albumSongs.length === 0) return;

    const shuffled = [...albumSongs].sort(
      () => Math.random() - 0.5
    );

    playSong(shuffled[0], shuffled);
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-8 py-10 max-w-7xl mx-auto text-zinc-400">
        Loading album...
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="px-4 sm:px-8 py-10 max-w-7xl mx-auto space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <p className="text-red-400">
          {error || 'Album not found.'}
        </p>

        <Link
          to="/home"
          className="inline-block text-purple-400 hover:text-purple-300"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-6 max-w-7xl mx-auto space-y-10">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Album Header */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end bg-gradient-to-b from-[#221C3E] via-[#1B1C2E] to-[#121320] p-6 sm:p-8 rounded-3xl border border-purple-800/40 shadow-2xl">
        <div className="md:col-span-4 lg:col-span-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl ring-1 ring-purple-600/30 bg-[#131422]">
            {artworkUrl ? (
              <img
                src={artworkUrl}
                alt={`${album.title} album cover`}
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-purple-400">
                Album artwork unavailable
              </div>
            )}

            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-black/70 text-purple-200">
              {album.language || 'Music'}
            </span>
          </div>
        </div>

        <div className="md:col-span-8 lg:col-span-9 space-y-4">
          <div className="space-y-1">
            <div className="text-xs uppercase font-bold tracking-wider text-[#8B5CF6]">
              Album{album.genre ? ` · ${album.genre}` : ''}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {album.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-300">
            {artistId ? (
              <Link
                to={`/artists/${artistId}`}
                className="font-bold text-white hover:text-[#8B5CF6] transition-colors"
              >
                {artistName}
              </Link>
            ) : (
              <span className="font-bold text-white">
                {artistName}
              </span>
            )}

            <span className="text-zinc-600">·</span>
            <span>{album.release_year || 'Year unknown'}</span>
            <span className="text-zinc-600">·</span>
            <span>
              {albumSongs.length}{' '}
              {albumSongs.length === 1 ? 'song' : 'songs'}
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-purple-300">
              {totalMins} minutes
            </span>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300/90 max-w-2xl leading-relaxed">
            Listen to {album.title} by {artistName}.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={handlePlayAlbum}
              disabled={albumSongs.length === 0}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#7C3AED] hover:to-[#9333EA] disabled:opacity-50 text-white font-bold text-sm flex items-center gap-2.5 shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              {isAlbumPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}

              <span>
                {isAlbumPlaying ? 'Pause Album' : 'Play Album'}
              </span>
            </button>

            <button
              onClick={handleShuffleAlbum}
              disabled={albumSongs.length === 0}
              className="px-5 py-3 rounded-full bg-[#1B1C2E] hover:bg-[#25273F] border border-purple-800/40 disabled:opacity-50 text-zinc-200 hover:text-white font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Shuffle className="w-4 h-4" />
              <span>Shuffle</span>
            </button>

            <button
              onClick={() => setAlbumLiked((previous) => !previous)}
              className={`p-3 rounded-full border transition-all cursor-pointer ${
                albumLiked
                  ? 'border-pink-500/50 bg-pink-500/10 text-pink-500'
                  : 'border-purple-800/40 bg-[#1B1C2E] text-zinc-300 hover:text-white hover:border-purple-600'
              }`}
              title={albumLiked ? 'Saved to library' : 'Save album'}
            >
              <Heart
                className={`w-5 h-5 ${
                  albumLiked ? 'fill-pink-500' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Track Listing */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
          <h2 className="text-lg font-bold text-white">Tracklist</h2>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Duration</span>
          </div>
        </div>

        <div className="bg-[#1B1C2E]/60 rounded-2xl p-2 border border-purple-900/30 divide-y divide-purple-950/40">
          {albumSongs.length > 0 ? (
            albumSongs.map((song, index) => (
              <div key={song.id} className="relative">
                <SongRow
                  song={song}
                  index={index}
                  showAlbum={false}
                />

                {Number(song.duration_seconds || song.durationSec) > 0 && (
                  <span className="absolute right-4 bottom-3 text-[11px] text-zinc-500 pointer-events-none">
                    {formatDuration(
                      Number(song.duration_seconds || song.durationSec)
                    )}
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="p-6 text-sm text-zinc-400">
              No songs are linked to this album yet. In Django Admin,
              open each song, select this album in the Album record
              field, and save it.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
