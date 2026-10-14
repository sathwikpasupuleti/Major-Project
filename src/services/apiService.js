
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000/api";

const BACKEND_URL = "http://127.0.0.1:8000";

// Convert Django image and audio paths into usable URLs.
function mediaUrl(path) {
  if (!path) return "";

  const value = String(path).trim();

  if (/^https?:\/\//i.test(value)) {
    const url = new URL(value);

    // Fix absolute URLs that point directly to /songs/ or /artists/.
    if (
      url.pathname.startsWith("/songs/") ||
      url.pathname.startsWith("/artists/")
    ) {
      url.pathname = `/media${url.pathname}`;
    }

    return url.toString();
  }

  let cleanPath = value.startsWith("/") ? value : `/${value}`;

  if (
    cleanPath.startsWith("/songs/") ||
    cleanPath.startsWith("/artists/")
  ) {
    cleanPath = `/media${cleanPath}`;
  }

  return `${BACKEND_URL}${cleanPath}`;
}

// Convert seconds into mm:ss format.
function formatDuration(seconds) {
  const totalSeconds = Number(seconds) || 0;
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

// Support normal arrays and paginated API responses.
function extractResults(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && Array.isArray(data.results)) {
    return data.results;
  }

  return [];
}

// Map Django artist fields to the frontend format.
function mapArtist(artist) {
  return {
    ...artist,
    id: String(artist.id),
    name: artist.name || "",
    imageUrl: mediaUrl(artist.image),
    bio: artist.bio || "",
    languages: artist.languages || [],
    verified: artist.verified ?? false,
  };
}

// Map Django song fields to the frontend format.
function mapSong(song) {
  const artistId =
    song.artist != null && typeof song.artist !== "object"
      ? String(song.artist)
      : song.artist?.id != null
        ? String(song.artist.id)
        : "";

  return {
    ...song,
    id: String(song.id),
    title: song.title || "",
    artist: song.artist_name || song.artist?.name || "",
    artistId,
    album: song.album || "",
    language: song.language || "",
    mood: song.mood || "",
    genre: song.genre || "",
    durationSec: Number(song.duration_seconds) || 0,
    duration: formatDuration(song.duration_seconds),
    artworkUrl: mediaUrl(song.artwork),
    audioUrl: mediaUrl(song.audio_file),
    source: "local",
  };
}

// Fetch data from Django.
async function fetchData(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(
      `API request failed: ${endpoint} (${response.status})`
    );
  }

  return response.json();
}

export const apiService = {
  // Fetch songs saved in your Django database.
  async getSongs() {
    const data = await fetchData("/songs/");
    return extractResults(data).map(mapSong);
  },

  // Fetch artists saved in your Django database.
  async getArtists() {
    const data = await fetchData("/artists/");
    return extractResults(data).map(mapArtist);
  },

  // Fetch one song by ID, if the backend provides this endpoint.
  async getSongById(id) {
    const data = await fetchData(`/songs/${id}/`);
    return mapSong(data);
  },

  // Search only the songs saved in your own database.
  async searchSongs(searchTerm) {
    const songs = await this.getSongs();
    const query = String(searchTerm || "").toLowerCase().trim();

    if (!query) return songs;

    return songs.filter((song) =>
      [
        song.title,
        song.artist,
        song.album,
        song.genre,
        song.language,
        song.mood,
      ].some((value) =>
        String(value || "").toLowerCase().includes(query)
      )
    );
  },

  // Search external songs through your Django iTunes search endpoint.
  async searchExternalSongs(searchTerm) {
    const query = String(searchTerm || "").trim();

    if (!query) return [];

    const response = await fetch(
      `${BASE_URL}/search/?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(
        `External music search failed: ${response.status}`
      );
    }

    const data = await response.json();

    return extractResults(data).map((track) => {
      const durationSec = Math.floor(
        (Number(track.duration_ms) || 0) / 1000
      );

      return {
        id: `itunes-${track.track_id}`,
        externalId: track.track_id,
        title: track.title || "",
        artist: track.artist || "",
        album: track.album || "",
        artworkUrl: track.artwork
  ? track.artwork.replace("100x100bb", "1000x1000bb")
  : "",
        audioUrl: track.preview_url || "",
        trackUrl: track.track_url || "",
        durationSec,
        duration: formatDuration(durationSec),
        source: "itunes",
      };
    });
  },

  // Filter local songs by language.
  async getSongsByLanguage(language) {
    const songs = await this.getSongs();

    if (!language || language.toLowerCase() === "all") {
      return songs;
    }

    return songs.filter(
      (song) =>
        song.language.toLowerCase() === language.toLowerCase()
    );
  },
  async getAlbums() {
  const data = await fetchData("/albums/");

  return extractResults(data).map((album) => ({
    ...album,
    id: String(album.id),
    title: album.title || "",
    artist: album.artist_name || "",
    artistId:
      album.artist != null ? String(album.artist) : "",
    artworkUrl: mediaUrl(album.artwork),
    releaseYear: album.release_year || null,
    language: album.language || "",
    genre: album.genre || "",
    source: "local",
  }));
},

async getAlbums() {
  const data = await fetchData("/albums/");

  return extractResults(data).map((album) => ({
    ...album,
    id: String(album.id),
    title: album.title || "",
    artist: album.artist_name || "",
    artworkUrl: mediaUrl(album.artwork),
    releaseYear: album.release_year || null,
    language: album.language || "",
    genre: album.genre || "",
  }));
},


  // Filter local songs by mood.
  async getSongsByMood(mood) {
    const songs = await this.getSongs();

    if (!mood || mood.toLowerCase() === "all") {
      return songs;
    }

    return songs.filter(
      (song) => song.mood.toLowerCase() === mood.toLowerCase()
    );
  },
};


export { mapSong, mapArtist, mediaUrl, formatDuration };
export default apiService;
