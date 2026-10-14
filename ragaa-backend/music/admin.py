
from django.contrib import admin
from .models import Artist, Song, Album


@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)


@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "artist", "release_year", "language")
    list_filter = ("language", "genre", "release_year")
    search_fields = ("title", "artist__name")


@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "artist", "album", "language", "mood")
    list_filter = ("language", "mood", "genre")
    search_fields = ("title", "artist__name", "album")
