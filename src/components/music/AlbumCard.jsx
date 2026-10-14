import React, { useState } from 'react';
import { Play, Pause, Disc } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { apiService } from '../../services/apiService';

export default function AlbumCard({ album }) {
  const {
    playSong,
    songsList,
    currentSong,
    isPlaying,
    togglePlay,
  } = useMusicPlayer();

  const [isLoadingAlbum, setIsLoadingAlbum] = useState(false);

  if (!album) return null;

  const title = album.title || 'Untitled Album';

  const artist =
    album.artist_name ||
    (typeof album.artist === 'object' ? album.artist?.name : '') ||
    album.artist ||
    'Unknown Artist';

  const artistId =
    typeof album.artist === 'object'
      ? album.artist?.id
      : album.artistId ||
        (typeof album.artist === 'number' ? album.artist : null);

  const language = album.language || 'Music';
  const year = album.release_year || album.year || '';

  const artwork =
    album.artworkUrl ||
    album.artwork ||
    album.coverUrl ||
    '';

  const apiBase = (
    import.meta.env.VITE_API_BASE_URL ||
    'http://127.0.0.1:8000/api'
  ).replace(/\/api\/?$/, '');

  const artworkUrl = artwork
    ? /^https?:\/\//i.test(artwork)
      ? artwork
      : `${apiBase}/${artwork.replace(/^\/+/, '')}`
    : '';

  const allSongs = Array.isArray(songsList) ? songsList : [];

  const belongsToAlbum = (song) => {
    if (!song) return false;

    const record = song.album_record;
    const recordId =
      typeof record === 'object' ? record?.id : record;

    return (
      String(recordId ?? '') === String(album.id) ||
      (
        typeof song.album === 'string' &&
        song.album.trim().toLowerCase() === title.trim().toLowerCase()
      )
    );
  };

  const albumSongs = allSongs.filter(belongsToAlbum);

  const currentSongBelongsToAlbum =
    currentSong && belongsToAlbum(currentSong);

  const isThisAlbumPlaying =
    Boolean(isPlaying && currentSongBelongsToAlbum);

  const trackCount =
    Number(album.track_count ?? albumSongs.length ?? 0);

  const handlePlayAlbum = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isLoadingAlbum) return;

    setIsLoadingAlbum(true);

    try {
      let tracks = allSongs.filter(belongsToAlbum);

      if (tracks.length === 0) {
        const response = await apiService.getSongs();
        const fetchedSongs = Array.isArray(response) ? response : [];

        tracks = fetchedSongs.filter(belongsToAlbum);
      }

      if (tracks.length === 0) {
        window.alert(
          `No songs are linked to "${title}" yet. In Django Admin, open each song, select this album in Album record, and save.`
        );
        return;
      }

      playSong(tracks[0], tracks);
    } catch (error) {
      console.error('Unable to play album:', error);
      window.alert(
        'Unable to load this album. Please check that Django is running.'
      );
    } finally {
      setIsLoadingAlbum(false);
    }
  };

  const handlePlaybackClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isThisAlbumPlaying) {
      togglePlay();
    } else {
      handlePlayAlbum(event);
    }
  };

  return (
    <div className="group relative bg-[#1B1C2E] rounded-xl p-3 border border-purple-900/30 hover:border-purple-600/50 hover:bg-[#202237] transition-all flex flex-col">
      <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-3 bg-[#131422]">
        {artworkUrl ? (
          <img
            src={artworkUrl}
            alt={`${title} album cover`}
            onError={(event) => {
              console.error('Album artwork failed to load:', artworkUrl);
              event.currentTarget.style.display = 'none';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Disc className="w-16 h-16 text-purple-500" />
          </div>
        )}

        <button
          type="button"
          onClick={handlePlaybackClick}
          disabled={isLoadingAlbum}
          aria-label={
            isThisAlbumPlaying
              ? `Pause ${title}`
              : `Play ${title}`
          }
          title={
            isThisAlbumPlaying
              ? 'Pause album'
              : 'Play album'
          }
          className="absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg shadow-purple-600/30 cursor-pointer disabled:opacity-70"
        >
          {isThisAlbumPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/60 text-purple-200">
          {language}
        </span>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Link
          to={`/albums/${album.id}`}
          className="text-sm font-semibold text-white truncate hover:text-[#8B5CF6] transition-colors"
        >
          {title}
        </Link>

        {artistId ? (
          <Link
            to={`/artists/${artistId}`}
            className="text-xs text-zinc-400 truncate hover:text-zinc-200 transition-colors mt-0.5"
          >
            {artist}
          </Link>
        ) : (
          <span className="text-xs text-zinc-400 truncate mt-0.5">
            {artist}
          </span>
        )}

        <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-2 pt-2 border-t border-purple-950/40">
          <span>{year}</span>
          <span className="text-purple-300/70">
            {trackCount} {trackCount === 1 ? 'track' : 'tracks'}
          </span>
        </div>
      </div>
    </div>
  );
}
