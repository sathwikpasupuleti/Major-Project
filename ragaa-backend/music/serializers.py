
from rest_framework import serializers
from .models import Song, Artist, Album


class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = "__all__"


class AlbumSerializer(serializers.ModelSerializer):
    artist_name = serializers.CharField(
        source="artist.name",
        read_only=True
    )
    artwork = serializers.SerializerMethodField()

    class Meta:
        model = Album
        fields = "__all__"

    def get_artwork(self, obj):
        request = self.context.get("request")

        if obj.artwork:
            url = obj.artwork.url
            return request.build_absolute_uri(url) if request else url

        return None


class SongSerializer(serializers.ModelSerializer):
    artist_name = serializers.CharField(
        source="artist.name",
        read_only=True
    )
    artwork = serializers.SerializerMethodField()
    audio_file = serializers.SerializerMethodField()

    class Meta:
        model = Song
        fields = "__all__"

    def get_artwork(self, obj):
        request = self.context.get("request")

        if obj.artwork:
            url = obj.artwork.url
            return request.build_absolute_uri(url) if request else url

        return None

    def get_audio_file(self, obj):
        request = self.context.get("request")

        if obj.audio_file:
            url = obj.audio_file.url
            return request.build_absolute_uri(url) if request else url

        return None
