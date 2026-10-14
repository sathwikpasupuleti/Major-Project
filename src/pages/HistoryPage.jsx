
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Music2 } from 'lucide-react';

import { useMusicPlayer } from '../context/MusicPlayerContext';
import { apiService } from '../services/apiService';
import SongRow from '../components/music/SongRow';

export default function HistoryPage() {
  const {
    history = [],
    songsList = [],
  } = useMusicPlayer();

  const [period, setPeriod] = useState('today');
  const [apiSongs, setApiSongs] = useState([]);

  React.useEffect(() => {
    let active = true;

    apiService.getSongs()
      .then((response) => {
        if (!active) return;
        const data = Array.isArray(response)
          ? response
          : response?.results || [];
        setApiSongs(data);
      })
      .catch((error) => {
        console.error('Could not load songs for history:', error);
      });

    return () => {
      active = false;
    };
  }, []);

  const allSongs = useMemo(() => {
    const combined = [...songsList, ...apiSongs];
    return combined.filter(
      (song, index, array) =>
        array.findIndex(
          (item) => String(item.id) === String(song.id)
        ) === index
    );
  }, [songsList, apiSongs]);

  const filteredHistory = useMemo(() => {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(startOfToday);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(
      startOfWeek.getDate() - (day === 0 ? 6 : day - 1)
    );

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    return history
      .map((entry) => {
        const id = entry.songId ?? entry.song?.id ?? entry.id;

        const song = allSongs.find(
          (item) => String(item.id) === String(id)
        );

        const rawDate =
          entry.playedAt ??
          entry.timestamp ??
          entry.date ??
          entry.created_at;

        const playedAt = rawDate ? new Date(rawDate) : null;

        return {
          ...entry,
          song,
          playedAt:
            playedAt && !Number.isNaN(playedAt.getTime())
              ? playedAt
              : null,
        };
      })
      .filter((entry) => entry.song)
      .filter((entry) => {
        if (period === 'all') return true;

        // Entries without timestamps can appear under All Time,
        // but cannot reliably be assigned to a date filter.
        if (!entry.playedAt) return false;

        if (period === 'today') {
          return entry.playedAt >= startOfToday;
        }

        if (period === 'week') {
          return entry.playedAt >= startOfWeek;
        }

        if (period === 'month') {
          return entry.playedAt >= startOfMonth;
        }

        return true;
      })
      .sort((a, b) => {
        if (!a.playedAt) return 1;
        if (!b.playedAt) return -1;
        return b.playedAt - a.playedAt;
      });
  }, [history, allSongs, period]);

  const filters = [
    { id: 'all', label: 'All Time' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
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

      <header>
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-700/40 bg-purple-950/60 px-3 py-1 text-xs text-purple-300">
          <Clock className="w-4 h-4" />
          Playback Timeline
        </div>

        <h1 className="mt-3 text-3xl font-extrabold">
          Listening History
        </h1>

        <p className="mt-2 text-sm text-zinc-400">
          Revisit your recently streamed Telugu, Hindi, Tamil and English tracks.
        </p>
      </header>

      <nav className="flex flex-wrap gap-2 border-b border-purple-900/30 pb-3">
        {filters.map((filter) => (
          <button
            type="button"
            key={filter.id}
            onClick={() => setPeriod(filter.id)}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold ${
              period === filter.id
                ? 'bg-purple-600 text-white'
                : 'text-zinc-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </nav>

      {filteredHistory.length > 0 ? (
        <section className="rounded-2xl border border-purple-900/30 bg-[#1B1C2E]/60 p-2 divide-y divide-purple-950/40">
          {filteredHistory.map((entry, index) => (
            <div key={`${entry.song.id}-${index}`}>
              <SongRow
                song={entry.song}
                index={index}
                showAlbum={true}
                playedAt={
                  entry.playedAt
                    ? entry.playedAt.toLocaleString()
                    : null
                }
              />
            </div>
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-purple-900/30 bg-[#171827] min-h-80 flex flex-col items-center justify-center text-center p-8">
          <div className="w-16 h-16 rounded-2xl bg-purple-950/70 border border-purple-800/50 flex items-center justify-center mb-6">
            <Clock className="w-8 h-8 text-purple-400" />
          </div>

          <h2 className="text-xl font-bold">
            No history found
          </h2>

          <p className="mt-2 max-w-md text-sm text-zinc-400">
            {period === 'today'
              ? "No songs played today. Try All Time or play a song and return here."
              : "No songs match this time period. Try another filter or play some music."}
          </p>

          <Link
            to="/home"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-3 text-sm font-bold"
          >
            <Music2 className="w-4 h-4" />
            Play Some Music
          </Link>
        </section>
      )}
    </main>
  );
}
