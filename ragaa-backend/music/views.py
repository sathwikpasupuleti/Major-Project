
import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

from django.core.cache import cache
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Artist, Song, Album
from .serializers import (
    ArtistSerializer,
    SongSerializer,
    AlbumSerializer,
)


class ArtistListAPIView(generics.ListAPIView):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer


class SongListAPIView(generics.ListAPIView):
    queryset = Song.objects.select_related(
        "artist", "album_record"
    ).all()
    serializer_class = SongSerializer


class AlbumListAPIView(generics.ListAPIView):
    queryset = Album.objects.select_related(
        "artist"
    ).order_by("title")
    serializer_class = AlbumSerializer


class MusicSearchAPIView(APIView):
    def get(self, request):
        query = request.query_params.get("q", "").strip()

        if not query:
            return Response({"results": []})

        cache_key = f"ragaa_itunes_search_{query.lower()}"
        cached_results = cache.get(cache_key)

        if cached_results is not None:
            return Response({"results": cached_results})

        params = urlencode({
            "term": query,
            "media": "music",
            "entity": "song",
            "country": "IN",
            "limit": 25,
        })

        url = f"https://itunes.apple.com/search?{params}"

        try:
            api_request = Request(
                url,
                headers={"User-Agent": "RagaaMusic/1.0"}
            )

            with urlopen(api_request, timeout=10) as response:
                data = json.loads(response.read().decode("utf-8"))

            results = []

            for track in data.get("results", []):
                # Only return actual song tracks.
                if track.get("wrapperType") != "track":
                    continue

                results.append({
                    "track_id": track.get("trackId"),
                    "title": track.get("trackName", ""),
                    "artist": track.get("artistName", ""),
                    "album": track.get("collectionName", ""),
                    "artwork": (
                        track.get("artworkUrl100", "")
                        .replace("100x100bb", "600x600bb")
                    ),
                    "preview_url": track.get("previewUrl", ""),
                    "track_url": track.get("trackViewUrl", ""),
                    "duration_ms": track.get("trackTimeMillis", 0),
                })

            cache.set(cache_key, results, timeout=300)

            return Response({"results": results})

        except (HTTPError, URLError, TimeoutError, OSError, ValueError) as error:
            print(f"iTunes search failed: {error}")

            return Response(
                {
                    "results": [],
                    "error": (
                        "Unable to reach iTunes search. "
                        "Please try again."
                    ),
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )
