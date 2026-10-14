import React, { useEffect, useState } from 'react';
import {
  useParams,
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import {
  Play,
  Pause,
  Heart,
  ArrowLeft,
} from 'lucide-react';

import { useMusicPlayer } from '../context/MusicPlayerContext';
import { apiService } from '../services/apiService';
import { SONGS, ARTISTS, ALBUMS } from '../data/mockData';
import SongCard from '../components/music/SongCard';

export default function SongDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const passedSong = location.state?.song;

  const {
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
    toggleLike,
    isLiked,
  } = useMusicPlayer();

  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadSong() {
      setLoading(true);
      setError('');

      // Use the selected search result when available.
      if (passedSong && String(passedSong.id) === String(id)) {
        setSong(passedSong);
        setLoading(false);
        return;
      }

      // Allow the current song to supply details if IDs match.
      if (
        currentSong &&
        String(currentSong.id) === String(id)
      ) {
        setSong(currentSong);
        setLoading(false);
        return;
      }

      try {
        const localSongs = await apiService.getSongs();

        const found = localSongs.find(
          (item) => String(item.id) === String(id)
        );

        if (active && found) {
          setSong(found);
          setLoading(false);
          return;
        }

        const mockSong = SONGS.find(
          (item) => String(item.id) === String(id)
        );

        if (active && mockSong) {
          setSong(mockSong);
          setLoading(false);
          return;
        }

        if (active) {
          setSong(null);
          setError(
            'Song not found. Please return to Search Music and select the song again.'
          );
        }
      } catch (err) {
        console.error('Failed to load song details:', err);

        if (active) {
          setError(
            'Unable to load song details. Please check your Django backend.'
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSong();

    return () => {
      active = false;
    };
  }, [id, passedSong, currentSong]);

  if (loading) {
    return (
      <div className="px-6 py-16 text-center text-purple-300">
        Loading song details...
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center space-y-4">
        <p className="text-zinc-300">
          {error || 'Song not found.'}
        </p>

        <button
          type="button"
          onClick={() => navigate('/search')}
          className="px-5 py-2 rounded-full bg-purple-600 text-white"
        >
          Back to Search
        </button>
      </div>
    );
  }

  const artistId =
    song.artistId ||
    (typeof song.artist === 'object' ? song.artist?.id : '') ||
    '';

  const artistName =
    typeof song.artist === 'string'
      ? song.artist
      : song.artist?.name || song.artist_name || 'Unknown Artist';

  const artist =
    ARTISTS.find(
      (item) =>
        String(item.id) === String(artistId) ||
        item.name === artistName
    ) || null;

  const albumId = song.albumId || '';

  const album =
    ALBUMS.find(
      (item) => String(item.id) === String(albumId)
    ) || null;

  const isThisCurrent =
    String(currentSong?.id) === String(song.id);

  const isThisPlaying = isThisCurrent && isPlaying;
  const liked = isLiked(song.id);

  const relatedSongs = SONGS.filter(
    (item) =>
      String(item.id) !== String(song.id) &&
      (
        item.language === song.language ||
        item.genre === song.genre
      )
  ).slice(0, 4);

  const handlePlayToggle = () => {
    if (isThisCurrent) {
      togglePlay();
    } else {
      playSong(song);
    }
  };

  return (
    <div className="px-4 sm:px-8 py-6 max-w-7xl mx-auto space-y-10">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Main song details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end bg-gradient-to-b from-[#221C3E] via-[#1B1C2E] to-[#121320] p-6 sm:p-8 rounded-3xl border border-purple-800/40 shadow-2xl">
        <div className="md:col-span-4 lg:col-span-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl ring-1 ring-purple-600/30">
            <img
              src={song.artworkUrl || song.artwork || ''}
              alt={song.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-black/70 text-purple-200">
              {song.language || 'Music'}
            </span>
          </div>
        </div>

        <div className="md:col-span-8 lg:col-span-9 space-y-4">
          <div className="space-y-1">
            <div className="text-xs uppercase font-bold tracking-wider text-[#8B5CF6]">
              {song.source === 'itunes' ? 'External Track' : 'Single Track'}
              {song.genre ? ` · ${song.genre}` : ''}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {song.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-300">
            {artist ? (
              <Link
                to={`/artists/${artist.id}`}
                className="font-bold text-white hover:text-[#8B5CF6]"
              >
                {artistName}
              </Link>
            ) : (
              <span className="font-bold text-white">
                {artistName}
              </span>
            )}

            {song.album && (
              <>
                <span className="text-zinc-600">·</span>
                {album ? (
                  <Link
                    to={`/albums/${album.id}`}
                    className="text-zinc-400 hover:text-white"
                  >
                    {song.album}
                  </Link>
                ) : (
                  <span className="text-zinc-400">
                    {song.album}
                  </span>
                )}
              </>
            )}

            <span className="text-zinc-600">·</span>
            <span className="font-mono">
              {song.duration || '—'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={handlePlayToggle}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white font-bold text-sm flex items-center gap-2.5 shadow-lg shadow-purple-600/30 hover:scale-105 transition-all"
            >
              {isThisPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  Pause Track
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  Play Track
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => toggleLike(song.id)}
              className={`p-3 rounded-full border ${
                liked
                  ? 'border-pink-500/50 bg-pink-500/10 text-pink-500'
                  : 'border-purple-800/40 bg-[#1B1C2E] text-zinc-300'
              }`}
              title={liked ? 'Liked' : 'Like song'}
            >
              <Heart
                className={`w-5 h-5 ${
                  liked ? 'fill-pink-500' : ''
                }`}
              />
            </button>
          </div>

        </div>
      </div>

      {/* Lyrics and artist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-[#1B1C2E]/60 rounded-3xl p-6 sm:p-8 border border-purple-900/30 space-y-4">
          <div className="flex items-center justify-between border-b border-purple-950/40 pb-3">
            <h2 className="text-lg font-bold text-white">
              Lyrics & Vibes
            </h2>
            <span className="text-xs text-purple-400 font-medium">
              {song.language || 'Music'}
            </span>
          </div>

          <div className="text-sm text-zinc-300 whitespace-pre-line leading-relaxed">
            {song.lyrics ||
              "Enjoy this track with Ragaa. Lyrics aren't available for this song yet."}
          </div>
        </div>

        {artist && (
          <div className="lg:col-span-5 bg-[#1B1C2E]/60 rounded-3xl p-6 sm:p-8 border border-purple-900/30 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-400">
              About The Artist
            </div>

            <div className="flex items-center gap-4">
              <img
                src={artist.imageUrl || ''}
                alt={artist.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover ring-2 ring-[#8B5CF6]"
              />

              <div>
                <Link
                  to={`/artists/${artist.id}`}
                  className="text-base font-bold text-white hover:text-[#8B5CF6]"
                >
                  {artist.name}
                </Link>

                <div className="text-xs text-zinc-400 mt-0.5">
                  {artist.monthlyListeners || ''} monthly listeners
                </div>
              </div>
            </div>

            <p className="text-xs text-zinc-300/80 leading-relaxed">
              {artist.bio || 'Discover more music from this artist.'}
            </p>

            <Link
              to={`/artists/${artist.id}`}
              className="inline-flex items-center text-xs font-bold text-[#8B5CF6]"
            >
              View Full Artist Profile →
            </Link>
          </div>
        )}
      </div>

      {/* Related songs */}
      {relatedSongs.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-purple-900/20">
          <h3 className="text-lg font-bold text-white">
            You Might Also Like
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedSongs.map((item) => (
              <SongCard key={item.id} song={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
