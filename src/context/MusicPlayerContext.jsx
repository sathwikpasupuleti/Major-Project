
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

import { apiService } from '../services/apiService';

const MusicPlayerContext = createContext(null);

const LIKED_KEY = 'ragaa_liked_songs';
const HISTORY_KEY = 'ragaa_history';
const PLAYLISTS_KEY = 'ragaa_playlists';

function readLocalArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export const MusicPlayerProvider = ({ children }) => {
  // Real songs from Django.
  const [songsList, setSongsList] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isLoadingSongs, setIsLoadingSongs] = useState(true);
  const [songLoadError, setSongLoadError] = useState(null);

  // Player state.
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off');
  const [queue, setQueue] = useState([]);
  const [audioError, setAudioError] = useState(null);

  const audioRef = useRef(null);
  const currentSongRef = useRef(null);
  const queueRef = useRef([]);
  const repeatModeRef = useRef('off');
  const shuffleRef = useRef(false);
  const volumeRef = useRef(0.85);
  const mutedRef = useRef(false);

  // No sample IDs: only songs liked by the user.
  const [likedSongIds, setLikedSongIds] = useState(
    () => readLocalArray(LIKED_KEY)
  );

  // No sample listening history.
  const [history, setHistory] = useState(
    () => readLocalArray(HISTORY_KEY)
  );

  // No INITIAL_PLAYLISTS or mock playlist fallback.
  const [playlists, setPlaylists] = useState(
    () => readLocalArray(PLAYLISTS_KEY)
  );

  // Keep refs synchronized with React state.
  useEffect(() => {
    currentSongRef.current = currentSong;
  }, [currentSong]);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    repeatModeRef.current = repeatMode;
  }, [repeatMode]);

  useEffect(() => {
    shuffleRef.current = isShuffle;
  }, [isShuffle]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    mutedRef.current = isMuted;
  }, [isMuted]);

  // Fetch songs from the Django API.
  useEffect(() => {
    let cancelled = false;

    async function loadSongs() {
      try {
        setIsLoadingSongs(true);
        setSongLoadError(null);

        const data = await apiService.getSongs();
        if (cancelled) return;

        const validSongs = Array.isArray(data) ? data : [];

        setSongsList(validSongs);
        setQueue(validSongs);
        queueRef.current = validSongs;

        // Remove saved likes that do not belong to real songs.
        const validIds = new Set(validSongs.map((song) => String(song.id)));

        setLikedSongIds((previous) =>
          previous.filter((id) => validIds.has(String(id)))
        );

        // Keep only history entries that match real songs.
        setHistory((previous) =>
          previous.filter((entry) =>
            validIds.has(String(entry.songId))
          )
        );

        if (validSongs.length > 0) {
          setCurrentSong(validSongs[0]);
          currentSongRef.current = validSongs[0];
          setDuration(validSongs[0].durationSec || 0);
        } else {
          setCurrentSong(null);
          currentSongRef.current = null;
          setSongLoadError(
            'No songs found. Add songs through Django Admin.'
          );
        }
      } catch (error) {
        console.error('Failed to load Django songs:', error);

        if (!cancelled) {
          setSongLoadError(
            'Could not load songs. Check that Django is running.'
          );
          setSongsList([]);
          setQueue([]);
          queueRef.current = [];
          setCurrentSong(null);
          currentSongRef.current = null;
        }
      } finally {
        if (!cancelled) setIsLoadingSongs(false);
      }
    }

    loadSongs();

    return () => {
      cancelled = true;
    };
  }, []);

  // Save likes, history, and user-created playlists locally.
  useEffect(() => {
    localStorage.setItem(LIKED_KEY, JSON.stringify(likedSongIds));
  }, [likedSongIds]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
  }, [playlists]);

  // Create the audio player and register its events.
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = volumeRef.current;
    audio.muted = mutedRef.current;
    audioRef.current = audio;

    const handleMetadata = () => {
      if (Number.isFinite(audio.duration)) {
        setDuration(Math.floor(audio.duration));
      }
      setAudioError(null);
    };

    const handleCanPlay = () => setAudioError(null);
    const handlePlay = () => {
      setIsPlaying(true);
      setAudioError(null);
    };
    const handlePause = () => setIsPlaying(false);

    const handleTimeUpdate = () => {
      setCurrentTime(Math.floor(audio.currentTime || 0));
    };

    const advanceToNextSong = () => {
      const currentQueue = queueRef.current;

      if (!currentQueue.length) {
        setIsPlaying(false);
        return;
      }

      const index = currentQueue.findIndex(
        (song) =>
          String(song.id) === String(currentSongRef.current?.id)
      );

      if (index < 0) {
        setIsPlaying(false);
        return;
      }

      if (repeatModeRef.current === 'one') {
        audio.currentTime = 0;
        audio.play().catch((error) => {
          console.error('Repeat playback failed:', error);
          setAudioError('Could not replay this song.');
        });
        return;
      }

      let nextIndex;

      if (shuffleRef.current && currentQueue.length > 1) {
        nextIndex = Math.floor(Math.random() * currentQueue.length);

        while (nextIndex === index) {
          nextIndex = Math.floor(Math.random() * currentQueue.length);
        }
      } else {
        nextIndex = index + 1;
      }

      if (nextIndex >= currentQueue.length) {
        if (repeatModeRef.current === 'all') {
          nextIndex = 0;
        } else {
          setIsPlaying(false);
          return;
        }
      }

      playSong(currentQueue[nextIndex], currentQueue);
    };

    const handleEnded = () => advanceToNextSong();

    const handleError = () => {
      if (!audio.error) return;

      const messages = {
        1: 'Audio playback was interrupted.',
        2: 'Network error. Check the Django media server.',
        3: 'The audio file could not be decoded.',
        4: 'The audio URL is missing or unsupported.',
      };

      const message =
        messages[audio.error.code] || 'Unable to play this audio file.';

      console.error('Audio error:', message, audio.currentSrc || audio.src);
      setAudioError(message);
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();

      audio.removeEventListener('loadedmetadata', handleMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);

      audioRef.current = null;
    };
  }, []);

  // Synchronize volume and mute settings.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Play a song from the database or a supported external preview.
  const playSong = useCallback((song, customQueue = null) => {
    if (!song) return;

    if (!song.audioUrl) {
      setAudioError('This song has no audio URL.');
      console.error('Missing audioUrl:', song);
      return;
    }

    const audio = audioRef.current;

    if (!audio) {
      setAudioError('The audio player is not ready.');
      return;
    }

    setCurrentSong(song);
    currentSongRef.current = song;
    setCurrentTime(0);
    setDuration(song.durationSec || 0);
    setAudioError(null);

    if (Array.isArray(customQueue) && customQueue.length > 0) {
      setQueue(customQueue);
      queueRef.current = customQueue;
    }

    setHistory((previous) => [
      {
        songId: song.id,
        playedAt: new Date().toISOString(),
      },
      ...previous
        .filter((item) => String(item.songId) !== String(song.id))
        .slice(0, 49),
    ]);

    audio.pause();
    audio.currentTime = 0;
    audio.src = String(song.audioUrl).trim();
    audio.volume = volumeRef.current;
    audio.muted = mutedRef.current;
    audio.load();

    audio.play().catch((error) => {
      console.error('Audio playback failed:', error);
      setIsPlaying(false);

      setAudioError(
        error.name === 'NotAllowedError'
          ? 'Click Play to start listening.'
          : 'Playback failed. Check the audio URL and file.'
      );
    });
  }, []);

  // Play or pause the current song.
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      return;
    }

    const song = currentSongRef.current;

    if (!song) {
      const firstSong = queueRef.current[0];
      if (firstSong) playSong(firstSong, queueRef.current);
      return;
    }

    if (!song.audioUrl) {
      setAudioError('This song has no audio URL.');
      return;
    }

    const expectedUrl = new URL(
      song.audioUrl,
      window.location.href
    ).href;

    if (audio.src !== expectedUrl) {
      audio.src = expectedUrl;
      audio.load();
    }

    if (
      Number.isFinite(audio.duration) &&
      audio.currentTime >= audio.duration
    ) {
      audio.currentTime = 0;
    }

    audio.volume = volumeRef.current;
    audio.muted = mutedRef.current;
    setAudioError(null);

    audio.play().catch((error) => {
      console.error('Play failed:', error);
      setIsPlaying(false);
      setAudioError('Could not play this song. Check its audio URL.');
    });
  }, [playSong]);

  const nextSong = useCallback(() => {
    const currentQueue = queueRef.current;
    if (!currentQueue.length) return;

    const index = currentQueue.findIndex(
      (song) => String(song.id) === String(currentSongRef.current?.id)
    );

    if (index < 0) return;

    let nextIndex;

    if (shuffleRef.current && currentQueue.length > 1) {
      nextIndex = Math.floor(Math.random() * currentQueue.length);

      while (nextIndex === index) {
        nextIndex = Math.floor(Math.random() * currentQueue.length);
      }
    } else {
      nextIndex = index + 1;
    }

    if (nextIndex >= currentQueue.length) {
      if (repeatModeRef.current === 'all') {
        nextIndex = 0;
      } else {
        setIsPlaying(false);
        return;
      }
    }

    playSong(currentQueue[nextIndex], currentQueue);
  }, [playSong]);

  const prevSong = useCallback(() => {
    const audio = audioRef.current;
    const currentQueue = queueRef.current;

    if (!currentQueue.length) return;

    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    const index = currentQueue.findIndex(
      (song) => String(song.id) === String(currentSongRef.current?.id)
    );

    if (index < 0) return;

    const previousIndex =
      index <= 0 ? currentQueue.length - 1 : index - 1;

    playSong(currentQueue[previousIndex], currentQueue);
  }, [playSong]);

  const seekTo = useCallback((seconds) => {
    const audio = audioRef.current;
    if (!audio) return;

    const maxTime =
      Number.isFinite(audio.duration) && audio.duration > 0
        ? audio.duration
        : duration;

    const target = Math.max(
      0,
      Math.min(Number(seconds) || 0, maxTime)
    );

    audio.currentTime = target;
    setCurrentTime(Math.floor(target));
  }, [duration]);

  const setVolumeLevel = useCallback((newVolume) => {
    const level = Math.max(0, Math.min(1, Number(newVolume) || 0));

    setVolume(level);

    if (level > 0) setIsMuted(false);

    if (audioRef.current) {
      audioRef.current.volume = level;
      if (level > 0) audioRef.current.muted = false;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((previous) => {
      const next = !previous;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((previous) => !previous);
  }, []);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((previous) => {
      if (previous === 'off') return 'all';
      if (previous === 'all') return 'one';
      return 'off';
    });
  }, []);

  const toggleLike = useCallback((songId) => {
    setLikedSongIds((previous) =>
      previous.some((id) => String(id) === String(songId))
        ? previous.filter((id) => String(id) !== String(songId))
        : [...previous, songId]
    );
  }, []);

  const isLiked = useCallback(
    (songId) =>
      likedSongIds.some((id) => String(id) === String(songId)),
    [likedSongIds]
  );

  const addToQueue = useCallback((song) => {
    if (!song) return;
    setQueue((previous) => [...previous, song]);
  }, []);

  const removeFromQueue = useCallback((index) => {
    setQueue((previous) => previous.filter((_, i) => i !== index));
  }, []);

  const clearQueue = useCallback(() => {
    const current = currentSongRef.current;
    const nextQueue = current ? [current] : [];

    setQueue(nextQueue);
    queueRef.current = nextQueue;
  }, []);

  // User-created playlists only; no mock playlist defaults.
  const createPlaylist = useCallback((name, description = '') => {
    const playlist = {
      id: `pl-${Date.now()}`,
      name: name.trim() || 'My Playlist',
      description: description.trim(),
      coverUrl: currentSongRef.current?.artworkUrl || '',
      isUserCreated: true,
      songIds: [],
    };

    setPlaylists((previous) => [playlist, ...previous]);
    return playlist;
  }, []);

  const updatePlaylist = useCallback((id, data) => {
    setPlaylists((previous) =>
      previous.map((playlist) =>
        String(playlist.id) === String(id)
          ? { ...playlist, ...data }
          : playlist
      )
    );
  }, []);

  const deletePlaylist = useCallback((id) => {
    setPlaylists((previous) =>
      previous.filter((playlist) => String(playlist.id) !== String(id))
    );
  }, []);

  const addSongToPlaylist = useCallback((playlistId, songId) => {
    setPlaylists((previous) =>
      previous.map((playlist) => {
        if (String(playlist.id) !== String(playlistId)) {
          return playlist;
        }

        const ids = playlist.songIds || [];

        if (ids.some((id) => String(id) === String(songId))) {
          return playlist;
        }

        return { ...playlist, songIds: [...ids, songId] };
      })
    );
  }, []);

  const removeSongFromPlaylist = useCallback((playlistId, songId) => {
    setPlaylists((previous) =>
      previous.map((playlist) =>
        String(playlist.id) === String(playlistId)
          ? {
              ...playlist,
              songIds: (playlist.songIds || []).filter(
                (id) => String(id) !== String(songId)
              ),
            }
          : playlist
      )
    );
  }, []);

  const value = {
    songsList,
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    queue,
    likedSongIds,
    history,
    playlists,
    audioError,
    isLoadingSongs,
    songLoadError,
    playSong,
    togglePlay,
    nextSong,
    prevSong,
    seekTo,
    setVolumeLevel,
    toggleMute,
    toggleShuffle,
    cycleRepeatMode,
    toggleLike,
    isLiked,
    addToQueue,
    removeFromQueue,
    clearQueue,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);

  if (!context) {
    throw new Error(
      'useMusicPlayer must be used within a MusicPlayerProvider'
    );
  }

  return context;
};
