
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Flame,
  Compass,
  ArrowRight,
  Clock,
  Disc,
  Users,
  ListMusic,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { apiService } from '../services/apiService';

import SongCard from '../components/music/SongCard';
import SongRow from '../components/music/SongRow';
import AlbumCard from '../components/music/AlbumCard';
import ArtistCard from '../components/music/ArtistCard';
import PlaylistCard from '../components/music/PlaylistCard';
import LanguageFilter from '../components/common/LanguageFilter';

const MOOD_OPTIONS = [
  { name: 'Happy', emoji: '😊', color: 'from-amber-500/20 to-orange-500/10' },
  { name: 'Chill', emoji: '🌙', color: 'from-indigo-500/20 to-purple-500/10' },
  { name: 'Romantic', emoji: '💜', color: 'from-pink-500/20 to-fuchsia-500/10' },
  { name: 'Energetic', emoji: '⚡', color: 'from-violet-500/20 to-blue-500/10' },
  { name: 'Sad', emoji: '🌧️', color: 'from-sky-500/20 to-indigo-500/10' },
  { name: 'Focus', emoji: '🎧', color: 'from-emerald-500/20 to-teal-500/10' },
];

function normalize(value) {
  return String(value ?? '').trim().toLowerCase();
}

function getArray(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.results)) return response.results;
  return [];
}

export default function HomePage() {
  const { user } = useAuth();

  const {
    history = [],
    playlists = [],
    songsList = [],
  } = useMusicPlayer();

  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [artistError, setArtistError] = useState(false);
  const [albumError, setAlbumError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadMusicData() {
      setIsLoading(true);
      setApiError(false);
      setArtistError(false);
      setAlbumError(false);

      const [songsResult, artistsResult, albumsResult] =
        await Promise.allSettled([
          apiService.getSongs(),
          apiService.getArtists(),
          apiService.getAlbums(),
        ]);

      if (!active) return;

      if (songsResult.status === 'fulfilled') {
        setSongs(getArray(songsResult.value));
      } else {
        console.error('Failed to load Django songs:', songsResult.reason);
        setSongs([]);
        setApiError(true);
      }

      if (artistsResult.status === 'fulfilled') {
        setArtists(getArray(artistsResult.value));
      } else {
        console.error('Failed to load Django artists:', artistsResult.reason);
        setArtists([]);
        setArtistError(true);
      }

      if (albumsResult.status === 'fulfilled') {
        setAlbums(getArray(albumsResult.value));
      } else {
        console.error('Failed to load Django albums:', albumsResult.reason);
        setAlbums([]);
        setAlbumError(true);
      }

      setIsLoading(false);
    }

    loadMusicData();

    return () => {
      active = false;
    };
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';

    return 'Good evening';
  }, []);

  const userName = user?.name
    ? user.name.split(' ')[0]
    : 'Music Lover';

  const filteredSongs = useMemo(
    () =>
      songs.filter(
        (song) =>
          selectedLanguage === 'All' ||
          normalize(song.language) === normalize(selectedLanguage)
      ),
    [songs, selectedLanguage]
  );

  const filteredArtists = artists;

  const filteredAlbums = useMemo(
    () =>
      albums.filter(
        (album) =>
          selectedLanguage === 'All' ||
          normalize(album.language) === normalize(selectedLanguage)
      ),
    [albums, selectedLanguage]
  );

  // Resolve listening history against real songs.
  const recentPlayedSongs = useMemo(
    () =>
      history
        .map((item) => {
          const songId = item.songId ?? item.song?.id;

          const song =
            songs.find(
              (entry) => String(entry.id) === String(songId)
            ) ||
            songsList.find(
              (entry) => String(entry.id) === String(songId)
            );

          return {
            song,
            playedAt: item.playedAt,
          };
        })
        .filter((item) => item.song)
        .filter(
          (item, index, array) =>
            array.findIndex(
              (other) =>
                String(other.song.id) === String(item.song.id)
            ) === index
        )
        .slice(0, 4),
    [history, songs, songsList]
  );

  // IMPORTANT: never show curated/demo playlists on Home.
  // Only playlists explicitly created by the user are displayed.
  const userPlaylists = useMemo(
    () =>
      (Array.isArray(playlists) ? playlists : [])
        .filter((playlist) => playlist.isUserCreated === true)
        .slice(0, 2),
    [playlists]
  );

  const moodSongs = (moodName) =>
    filteredSongs.filter(
      (song) => normalize(song.mood) === normalize(moodName)
    );

  return (
    <div className="px-4 sm:px-8 py-6 max-w-7xl mx-auto space-y-10">
      {/* Welcome banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1F1B3B] via-[#1B1C2E] to-[#161726] border border-purple-800/40 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-700/40 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>Multilingual Music Engine</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              {greeting},{' '}
              <span className="text-[#A855F7]">{userName}</span>
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Explore songs across Telugu, Hindi, Tamil, and English.
              Discover music by mood, artist, or album.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link
              to="/mood-discovery"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#7C3AED] hover:to-[#9333EA] shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Moods</span>
            </Link>

            <Link
              to="/library"
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-[#10111B]/80 hover:bg-[#10111B] border border-purple-900/40 transition-all"
            >
              My Library
            </Link>
          </div>
        </div>
      </section>

      {/* Language filter */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Filter by Language
          </div>

          <span className="text-[11px] text-purple-400">
            {filteredSongs.length} tracks available
          </span>
        </div>

        <LanguageFilter
          selectedLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
          includeAll={true}
        />
      </section>

      {/* Mood discovery */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#8B5CF6]" />
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Discover by Mood
            </h2>
          </div>

          <Link
            to="/mood-discovery"
            className="text-xs font-semibold text-[#8B5CF6] hover:text-[#A855F7] flex items-center gap-1"
          >
            Explore Moods
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {MOOD_OPTIONS.map((mood) => {
            const count = moodSongs(mood.name).length;

            return (
              <Link
                key={mood.name}
                to={`/search?q=${encodeURIComponent(mood.name)}`}
                className={`rounded-2xl border border-purple-900/30 bg-gradient-to-br ${mood.color} p-4 hover:border-purple-500/60 transition-all`}
              >
                <div className="text-2xl mb-3">{mood.emoji}</div>
                <div className="text-sm font-bold text-white">
                  {mood.name}
                </div>
                <div className="text-xs text-zinc-400 mt-1">
                  {count} matching {count === 1 ? 'song' : 'songs'}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Real songs from Django */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Songs in Your Library
            </h2>
          </div>

          <Link
            to="/search"
            className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1"
          >
            See More
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {isLoading ? (
            <p className="col-span-full text-sm text-zinc-400">
              Loading songs...
            </p>
          ) : filteredSongs.length > 0 ? (
            filteredSongs.slice(0, 6).map((song) => (
              <SongCard key={song.id} song={song} />
            ))
          ) : (
            <p className="col-span-full text-sm text-zinc-400">
              {apiError
                ? 'Unable to load songs. Check that Django is running and the API URL is correct.'
                : 'No songs available for this language. Add songs through Django Admin.'}
            </p>
          )}
        </div>
      </section>

      {/* Real artists from Django */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#8B5CF6]" />
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Artists
            </h2>
          </div>

          <span className="text-xs text-zinc-500">
            From your music catalog
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {isLoading ? (
            <p className="col-span-full text-sm text-zinc-400">
              Loading artists...
            </p>
          ) : filteredArtists.length > 0 ? (
            filteredArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))
          ) : (
            <p className="col-span-full text-sm text-zinc-400">
              {artistError
                ? 'Unable to load artists. Check the Django artists API.'
                : 'No artists available. Add artists through Django Admin.'}
            </p>
          )}
        </div>
      </section>

      {/* Real albums from Django */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Disc className="w-5 h-5 text-[#8B5CF6]" />
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Albums
            </h2>
          </div>

          <span className="text-xs text-zinc-500">
            From your music catalog
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading ? (
            <p className="col-span-full text-sm text-zinc-400">
              Loading albums...
            </p>
          ) : filteredAlbums.length > 0 ? (
            filteredAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))
          ) : (
            <p className="col-span-full text-sm text-zinc-400">
              {albumError
                ? 'Unable to load albums. Check the Django albums API.'
                : 'No albums available for this language. Add albums through Django Admin.'}
            </p>
          )}
        </div>
      </section>

      {/* Recently played and user-created playlists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
        <section className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8B5CF6]" />
              <h3 className="text-base font-bold text-white">
                Recently Played
              </h3>
            </div>

            <Link
              to="/history"
              className="text-xs text-zinc-400 hover:text-white"
            >
              Full History
            </Link>
          </div>

          <div className="bg-[#1B1C2E]/60 rounded-2xl p-2 border border-purple-900/30 divide-y divide-purple-950/40">
            {recentPlayedSongs.length > 0 ? (
              recentPlayedSongs.map((item, index) => (
                <SongRow
                  key={`${item.song.id}-${index}`}
                  song={item.song}
                  index={index}
                  showAlbum={false}
                  playedAt={item.playedAt || null}
                />
              ))
            ) : (
              <div className="p-6 text-center text-xs text-zinc-500">
                No songs in your recent history yet. Play a song to see it here.
              </div>
            )}
          </div>
        </section>

        <section className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListMusic className="w-4 h-4 text-[#8B5CF6]" />
              <h3 className="text-base font-bold text-white">
                Your Playlists
              </h3>
            </div>

            <Link
              to="/library"
              className="text-xs text-zinc-400 hover:text-white"
            >
              View Library
            </Link>
          </div>

          {userPlaylists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userPlaylists.map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-purple-900/30 bg-[#1B1C2E]/60 p-6 text-center">
              <ListMusic className="w-8 h-8 text-purple-400 mx-auto mb-3" />

              <p className="text-sm font-semibold text-white">
                No playlists created yet
              </p>

              <p className="text-xs text-zinc-400 mt-1">
                Create a playlist in your Library and it will appear here.
              </p>

              <Link
                to="/library"
                className="inline-flex mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
              >
                Create Playlist
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
