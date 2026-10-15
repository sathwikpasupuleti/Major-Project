
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Play,
  Shuffle,
  Check,
  Plus,
  ArrowLeft,
  BadgeCheck,
} from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import SongRow from '../components/music/SongRow';
import AlbumCard from '../components/music/AlbumCard';

const API_BASE = 'https://ragaa-music-app-2026.onrender.com';

const getImageUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_BASE}${url}`;
};

export default function ArtistDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playSong } = useMusicPlayer();

  const [isFollowing, setIsFollowing] = useState(false);
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadArtistData() {
      setLoading(true);
      setError('');

      try {
        const [artistsRes, songsRes, albumsRes] = await Promise.all([
          fetch(`${API_BASE}/api/artists/`),
          fetch(`${API_BASE}/api/songs/`),
          fetch(`${API_BASE}/api/albums/`),
        ]);

        if (!artistsRes.ok || !songsRes.ok || !albumsRes.ok) {
          throw new Error('Unable to load music data from the server.');
        }

        const [artistsData, songsData, albumsData] = await Promise.all([
          artistsRes.json(),
          songsRes.json(),
          albumsRes.json(),
        ]);

        const artists = Array.isArray(artistsData)
          ? artistsData
          : artistsData.results || [];

        const allSongs = Array.isArray(songsData)
          ? songsData
          : songsData.results || [];

        const allAlbums = Array.isArray(albumsData)
          ? albumsData
          : albumsData.results || [];

        // Match the URL ID with the Django artist ID.
        const selectedArtist = artists.find(
          (item) => String(item.id) === String(id)
        );

        if (!selectedArtist) {
          throw new Error(
            'Artist not found in the database. Check the artist ID in the URL.'
          );
        }

        const artistSongs = allSongs.filter(
          (song) =>
            String(song.artist) === String(selectedArtist.id) ||
            String(song.artist_id) === String(selectedArtist.id) ||
            String(song.artist?.id) === String(selectedArtist.id) ||
            String(song.artist_name || '').toLowerCase() ===
              selectedArtist.name.toLowerCase()
        );

        const artistAlbums = allAlbums.filter(
          (album) =>
            String(album.artist) === String(selectedArtist.id) ||
            String(album.artist_id) === String(selectedArtist.id) ||
            String(album.artist?.id) === String(selectedArtist.id) ||
            String(album.artist_name || '').toLowerCase() ===
              selectedArtist.name.toLowerCase()
        );

        if (!active) return;

        setArtist({
          ...selectedArtist,
          imageUrl: getImageUrl(
            selectedArtist.image || selectedArtist.image_url
          ),
          bio: selectedArtist.bio || 'Discover music by this artist.',
          monthlyListeners: selectedArtist.monthly_listeners || 0,
          languages: selectedArtist.languages || [],
        });

        setSongs(artistSongs.map((song) => ({
          ...song,
          artwork: getImageUrl(song.artwork),
          audio_file: getImageUrl(song.audio_file),
          artistId: selectedArtist.id,
        })));

        setAlbums(artistAlbums.map((album) => ({
          ...album,
          artwork: getImageUrl(album.artwork),
          artistId: selectedArtist.id,
        })));
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadArtistData();

    return () => {
      active = false;
    };
  }, [id]);

  const handlePlayArtist = () => {
    if (songs.length) playSong(songs[0], songs);
  };

  const handleShuffleArtist = () => {
    if (!songs.length) return;

    const shuffled = [...songs].sort(() => Math.random() - 0.5);
    playSong(shuffled[0], shuffled);
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-white">
        Loading artist details...
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="p-10 text-center text-white space-y-4">
        <p>{error || 'Artist not found.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-purple-400 underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-6 max-w-7xl mx-auto space-y-10">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#20173B] via-[#1B1C2E] to-[#121320] border border-purple-800/40 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden shadow-2xl ring-4 ring-[#8B5CF6]/40 shrink-0">
            {artist.imageUrl && (
              <img
                src={artist.imageUrl}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-[#8B5CF6]" />
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Artist
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
              {artist.name}
            </h1>

            {artist.monthlyListeners > 0 && (
              <div className="text-sm text-zinc-300">
                {artist.monthlyListeners.toLocaleString()} monthly listeners
              </div>
            )}

            <p className="text-sm text-zinc-300/90 max-w-2xl leading-relaxed">
              {artist.bio}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handlePlayArtist}
                disabled={!songs.length}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white font-bold text-sm flex items-center gap-2.5 disabled:opacity-50"
              >
                <Play className="w-5 h-5 fill-current" />
                Play Popular
              </button>

              <button
                onClick={handleShuffleArtist}
                disabled={!songs.length}
                className="px-5 py-3 rounded-full bg-[#1B1C2E] border border-purple-800/40 text-white flex items-center gap-2 disabled:opacity-50"
              >
                <Shuffle className="w-4 h-4" />
                Shuffle
              </button>

              <button
                onClick={() => setIsFollowing((prev) => !prev)}
                className="px-5 py-3 rounded-full bg-[#1B1C2E] border border-purple-800/40 text-white flex items-center gap-2"
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
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">Popular Tracks</h2>

        <div className="bg-[#1B1C2E]/60 rounded-2xl p-2 border border-purple-900/30 divide-y divide-purple-950/40">
          {songs.length ? (
            songs.map((song, index) => (
              <SongRow key={song.id} song={song} index={index} />
            ))
          ) : (
            <p className="p-5 text-zinc-400">
              No songs have been added for this artist yet.
            </p>
          )}
        </div>
      </section>

      <section className="space-y-4 pt-4 border-t border-purple-900/20">
        <h2 className="text-xl font-bold text-white">
          Discography &amp; Albums
        </h2>

        {albums.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        ) : (
          <p className="text-zinc-400">
            No albums have been added for this artist yet.
          </p>
        )}
      </section>
    </div>
  );
}
