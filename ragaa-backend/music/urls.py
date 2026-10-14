
from django.urls import path
from .views import (
    ArtistListAPIView,
    SongListAPIView,
    AlbumListAPIView,
    MusicSearchAPIView,
)

urlpatterns = [
    path("artists/", ArtistListAPIView.as_view(), name="artist-list"),
    path("songs/", SongListAPIView.as_view(), name="song-list"),
    path("albums/", AlbumListAPIView.as_view(), name="album-list"),
    path("search/", MusicSearchAPIView.as_view(), name="music-search"),
]
