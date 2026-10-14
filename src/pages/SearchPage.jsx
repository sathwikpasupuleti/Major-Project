
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon,
  ArrowLeft,
  Music,
  Disc,
  Users,
  ListMusic,
} from 'lucide-react';

import SearchBar from '../components/common/SearchBar';
import LanguageFilter from '../components/common/LanguageFilter';
import EmptyState from '../components/common/EmptyState';
import SongCard from '../components/music/SongCard';
import SongRow from '../components/music/SongRow';
import AlbumCard from '../components/music/AlbumCard';
import ArtistCard from '../components/music/ArtistCard';

import { apiService } from '../services/apiService';

const normalize = (value) =>
  String(value ?? '').trim().toLowerCase();

const getArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState(
    searchParams.get('q') || ''
  );

  const [selectedLanguage, setSelectedLanguage] = useState(
    searchParams.get('language') || 'All'
  );

  const [activeTab, setActiveTab] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');

  const [localSongs, setLocalSongs] = useState([]);
  const [localAlbums, setLocalAlbums] = useState([]);
  const [localArtists, setLocalArtists] = useState([]);
  const [externalSongs, setExternalSongs] = useState([]);

  const [loadingLocal, setLoadingLocal] = useState(true);
  const [loadingExternal, setLoadingExternal] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Load real songs, albums and artists from Django.
  useEffect(() => {
    let active = true;

    async function loadLibrary() {
      try {
        const [songsResponse, albumsResponse, artistsResponse] =
          await Promise.all([
            apiService.getSongs(),
            apiService.getAlbums(),
            apiService.getArtists(),
          ]);

        if (!active) return;

        setLocalSongs(getArray(songsResponse));
        setLocalAlbums(getArray(albumsResponse));
        setLocalArtists(getArray(artistsResponse));
        setSearchError('');
      } catch (error) {
        console.error('Failed to load Django music library:', error);

        if (active) {
          setSearchError(
            'Could not load your music library. Make sure Django is running and check the API endpoints.'
          );
        }
      } finally {
        if (active) setLoadingLocal(false);
      }
    }

    loadLibrary();

    return () => {
      active = false;
    };
  }, []);

  // Synchronize the search query with the URL.
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    const urlLanguage = searchParams.get('language') || 'All';

    setQuery((current) =>
      current === urlQuery ? current : urlQuery
    );

    setSelectedLanguage((current) =>
      current === urlLanguage ? current : urlLanguage
    );
  }, [searchParams]);

  const handleQueryChange = (value) => {
    setQuery(value);

    const params = new URLSearchParams(searchParams);

    if (value.trim()) {
      params.set('q', value);
    } else {
      params.delete('q');
    }

    setSearchParams(params);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);

    const params = new URLSearchParams(searchParams);

    if (language === 'All') {
      params.delete('language');
    } else {
      params.set('language', language);
    }

    setSearchParams(params);
  };

  // Search external songs through the Django endpoint.
  useEffect(() => {
    const term = query.trim();
    let active = true;

    if (!term) {
      setExternalSongs([]);
      setLoadingExternal(false);
      return undefined;
    }

    setLoadingExternal(true);

    const timer = setTimeout(async () => {
      try {
        const response =
          await apiService.searchExternalSongs(term);

        if (active) {
          setExternalSongs(getArray(response));
        }
      } catch (error) {
        console.error('External music search failed:', error);

        if (active) {
          setExternalSongs([]);
        }
      } finally {
        if (active) setLoadingExternal(false);
      }
    }, 350);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  const genres = useMemo(() => {
    const values = new Set();

    localSongs.forEach((song) => {
      if (song.genre) {
        values.add(String(song.genre).split('/')[0].trim());
      }
    });

    return ['All', ...Array.from(values).filter(Boolean)];
  }, [localSongs]);

  const results = useMemo(() => {
    const q = normalize(query);

    const songsFromDatabase = localSongs.filter((song) => {
      const language = normalize(song.language);

      const matchesLanguage =
        selectedLanguage === 'All' ||
        language === normalize(selectedLanguage);

      const matchesGenre =
        selectedGenre === 'All' ||
        normalize(song.genre).includes(normalize(selectedGenre));

      if (!matchesLanguage || !matchesGenre) return false;
      if (!q) return true;

      return [
        song.title,
        song.artist_name,
        song.artist,
        song.album,
        song.genre,
        song.language,
        song.mood,
      ].some((value) => normalize(value).includes(q));
    });

    const databaseKeys = new Set(
      songsFromDatabase.map(
        (song) =>
          `${normalize(song.title)}|${normalize(
            song.artist_name || song.artist
          )}`
      )
    );

    const matchingExternalSongs = externalSongs.filter((song) => {
      const language = normalize(song.language);

      const matchesLanguage =
        selectedLanguage === 'All' ||
        !language ||
        language === normalize(selectedLanguage);

      const matchesGenre =
        selectedGenre === 'All' ||
        normalize(song.genre).includes(normalize(selectedGenre));

      const key =
        `${normalize(song.title)}|${normalize(
          song.artist_name || song.artist
        )}`;

      return (
        matchesLanguage &&
        matchesGenre &&
        !databaseKeys.has(key)
      );
    });

    const songs = [
      ...songsFromDatabase,
      ...matchingExternalSongs,
    ];

    const albums = localAlbums.filter((album) => {
      const matchesLanguage =
        selectedLanguage === 'All' ||
        normalize(album.language) === normalize(selectedLanguage);

      if (!matchesLanguage) return false;
      if (!q) return true;

      return [
        album.title,
        album.artist_name,
        album.artist,
        album.genre,
        album.language,
      ].some((value) => normalize(value).includes(q));
    });

    const artists = localArtists.filter((artist) => {
      const artistLanguages = Array.isArray(artist.languages)
        ? artist.languages
        : [artist.language];

      const matchesLanguage =
        selectedLanguage === 'All' ||
        artistLanguages.some(
          (language) =>
            normalize(language) === normalize(selectedLanguage)
        );

      if (!matchesLanguage) return false;
      if (!q) return true;

      return [
        artist.name,
        artist.bio,
        artist.genre,
        ...artistLanguages,
      ].some((value) => normalize(value).includes(q));
    });

    // No mock playlists. Add real playlists when a playlist
    // API or saved playlist source is connected.
    const playlists = [];

    return { songs, albums, artists, playlists };
  }, [
    query,
    selectedLanguage,
    selectedGenre,
    localSongs,
    localAlbums,
    localArtists,
    externalSongs,
  ]);

  const totalResultsCount =
    results.songs.length +
    results.albums.length +
    results.artists.length +
    results.playlists.length;

  const isLoading = loadingLocal || loadingExternal;

  const resetSearch = () => {
    setQuery('');
    setSelectedLanguage('All');
    setSelectedGenre('All');
    setActiveTab('All');
    setExternalSongs([]);
    setSearchParams({});
  };

  const tabs = [
    { id: 'All', label: 'All', count: totalResultsCount },
    { id: 'Songs', label: 'Songs', count: results.songs.length },
    { id: 'Albums', label: 'Albums', count: results.albums.length },
    { id: 'Artists', label: 'Artists', count: results.artists.length },
    {
      id: 'Playlists',
      label: 'Playlists',
      count: results.playlists.length,
    },
  ];

  return (
    <div className="px-4 sm:px-8 py-6 max-w-7xl mx-auto space-y-6">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Search Music
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Explore Telugu, Hindi, Tamil, and English songs,
            artists, albums and playlists.
          </p>
        </div>

        <SearchBar
          value={query}
          onChange={handleQueryChange}
          placeholder="Search by song title, singer, album name, or mood..."
          className="max-w-2xl"
        />
      </div>

      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-zinc-400">
            Language:
          </span>

          <LanguageFilter
            selectedLanguage={selectedLanguage}
            onSelectLanguage={handleLanguageChange}
            includeAll={true}
          />
        </div>

        {genres.length > 1 && (
          <div className="flex items-center gap-2 flex-wrap">
            <label
              htmlFor="search-genre"
              className="text-xs font-semibold text-zinc-400"
            >
              Genre:
            </label>

            <select
              id="search-genre"
              value={selectedGenre}
              onChange={(event) =>
                setSelectedGenre(event.target.value)
              }
              className="rounded-lg border border-purple-900/40 bg-[#1B1C2E] text-zinc-200 px-3 py-2 text-xs outline-none"
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-purple-900/30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#8B5CF6] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-[#1B1C2E]'
              }`}
            >
              {tab.label}{' '}
              <span className="opacity-70 text-[11px]">
                ({tab.count})
              </span>
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <p className="text-sm text-purple-300">
          Loading your music library and searching...
        </p>
      )}

      {searchError && (
        <p className="text-sm text-amber-300">
          {searchError}
        </p>
      )}

      {!isLoading && totalResultsCount === 0 ? (
        <EmptyState
          title={
            query
              ? `No results found for "${query}"`
              : 'Your library is empty'
          }
          description="Add songs, albums and artists through your Django backend, or try another search."
          actionLabel="Reset Search & Filters"
          onAction={resetSearch}
          icon={SearchIcon}
        />
      ) : (
        <div className="space-y-8 pt-2">
          {(activeTab === 'All' || activeTab === 'Songs') &&
            results.songs.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-[#8B5CF6]" />
                  <h2 className="text-base font-bold text-white">
                    Songs
                  </h2>
                  <span className="text-xs text-zinc-500">
                    ({results.songs.length})
                  </span>
                </div>

                {activeTab === 'All' ? (
                  <div className="bg-[#1B1C2E]/60 rounded-2xl p-2 border border-purple-900/30 divide-y divide-purple-950/40">
                    {results.songs.slice(0, 20).map((song, index) => (
                      <SongRow
                        key={`${song.source || 'local'}-${song.id ?? `${song.title}-${index}`}`}
                        song={song}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {results.songs.map((song, index) => (
                      <SongCard
                        key={`${song.source || 'local'}-${song.id ?? `${song.title}-${index}`}`}
                        song={song}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

          {(activeTab === 'All' || activeTab === 'Albums') &&
            results.albums.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <Disc className="w-4 h-4 text-[#8B5CF6]" />
                  <h2 className="text-base font-bold text-white">
                    Albums
                  </h2>
                  <span className="text-xs text-zinc-500">
                    ({results.albums.length})
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {results.albums.map((album) => (
                    <AlbumCard key={album.id} album={album} />
                  ))}
                </div>
              </section>
            )}

          {(activeTab === 'All' || activeTab === 'Artists') &&
            results.artists.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#8B5CF6]" />
                  <h2 className="text-base font-bold text-white">
                    Artists
                  </h2>
                  <span className="text-xs text-zinc-500">
                    ({results.artists.length})
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {results.artists.map((artist) => (
                    <ArtistCard
                      key={artist.id}
                      artist={artist}
                    />
                  ))}
                </div>
              </section>
            )}

          {(activeTab === 'All' || activeTab === 'Playlists') && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <ListMusic className="w-4 h-4 text-[#8B5CF6]" />
                <h2 className="text-base font-bold text-white">
                  Playlists
                </h2>
                <span className="text-xs text-zinc-500">
                  (0)
                </span>
              </div>

              <p className="text-sm text-zinc-400">
                No saved playlists are available yet.
              </p>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
