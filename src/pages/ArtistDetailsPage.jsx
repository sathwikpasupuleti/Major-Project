import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Shuffle,
  Check,
  Plus,
  ArrowLeft,
  Users,
  Disc,
  Sparkles,
  BadgeCheck,
} from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { ARTISTS, SONGS, ALBUMS } from '../data/mockData';
import SongRow from '../components/music/SongRow';
import AlbumCard from '../components/music/AlbumCard';

export default function ArtistDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playSong } = useMusicPlayer();
  const [isFollowing, setIsFollowing] = useState(false);

  const artist = ARTISTS.find(a => a.id === id) || ARTISTS[0];
  const artistSongs = SONGS.filter(s => s.artistId === artist.id);
  const artistAlbums = ALBUMS.filter(a => a.artistId === artist.id);

  const handlePlayArtist = () => {
    if (artistSongs.length > 0) {
      playSong(artistSongs[0], artistSongs);
    }
  };

  const handleShuffleArtist = () => {
    if (artistSongs.length > 0) {
      const shuffled = [...artistSongs].sort(() => Math.random() - 0.5);
      playSong(shuffled[0], shuffled);
    }
  };

  return (
    <div className="px-4 sm:px-8 py-6 max-w-7xl mx-auto space-y-10">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#20173B] via-[#1B1C2E] to-[#121320] border border-purple-800/40 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
          {/* Avatar */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden shadow-2xl ring-4 ring-[#8B5CF6]/40 shrink-0">
            <img
              src={artist.imageUrl}
              alt={artist.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-[#8B5CF6]" />
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Verified Artist
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {artist.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-zinc-300">
              <span className="font-semibold text-white">
                {artist.monthlyListeners} monthly listeners
              </span>
              <span>·</span>
              <span>Languages: {artist.languages.join(', ')}</span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300/90 max-w-2xl leading-relaxed">
              {artist.bio}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handlePlayArtist}
                disabled={artistSongs.length === 0}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#7C3AED] hover:to-[#9333EA] text-white font-bold text-sm flex items-center gap-2.5 shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-5 h-5 fill-current ml-0.5" />
                <span>Play Popular</span>
              </button>

              <button
                onClick={handleShuffleArtist}
                disabled={artistSongs.length === 0}
                className="px-5 py-3 rounded-full bg-[#1B1C2E] hover:bg-[#25273F] border border-purple-800/40 text-zinc-200 hover:text-white font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Shuffle className="w-4 h-4" />
                <span>Shuffle</span>
              </button>

              <button
                onClick={() => setIsFollowing(prev => !prev)}
                className={`px-5 py-3 rounded-full font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  isFollowing
                    ? 'bg-purple-950/60 text-purple-300 border border-purple-700/60'
                    : 'bg-[#1B1C2E] border border-purple-800/40 text-white hover:border-[#8B5CF6]'
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check className="w-4 h-4 text-purple-400" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Songs */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">Popular Tracks</h2>
        <div className="bg-[#1B1C2E]/60 rounded-2xl p-2 border border-purple-900/30 divide-y divide-purple-950/40">
          {artistSongs.map((song, index) => (
            <SongRow
              key={song.id}
              song={song}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* Albums Discography */}
      {artistAlbums.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-purple-900/20">
          <h2 className="text-xl font-bold text-white">Discography & Albums</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {artistAlbums.map(album => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
