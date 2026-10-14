
from django.db import models


class Artist(models.Model):
    name = models.CharField(max_length=150)
    bio = models.TextField(blank=True)
    image = models.ImageField(
        upload_to="artists/",
        blank=True,
        null=True
    )

    def __str__(self):
        return self.name


class Album(models.Model):
    title = models.CharField(max_length=200)
    artist = models.ForeignKey(
        Artist,
        on_delete=models.CASCADE,
        related_name="albums"
    )
    artwork = models.ImageField(
        upload_to="albums/artwork/",
        blank=True,
        null=True
    )
    release_year = models.PositiveIntegerField(
        blank=True,
        null=True
    )
    language = models.CharField(
        max_length=20,
        choices=[
            ("Telugu", "Telugu"),
            ("Hindi", "Hindi"),
            ("Tamil", "Tamil"),
            ("English", "English"),
        ],
        blank=True
    )
    genre = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.artist.name}"


class Song(models.Model):
    LANGUAGE_CHOICES = [
        ("Telugu", "Telugu"),
        ("Hindi", "Hindi"),
        ("Tamil", "Tamil"),
        ("English", "English"),
    ]

    MOOD_CHOICES = [
        ("Happy", "Happy"),
        ("Sad", "Sad"),
        ("Relaxed", "Relaxed"),
        ("Focus", "Focus"),
        ("Workout", "Workout"),
        ("Romantic", "Romantic"),
    ]

    title = models.CharField(max_length=200)
    artist = models.ForeignKey(
        Artist,
        on_delete=models.CASCADE,
        related_name="songs"
    )
    album = models.CharField(max_length=200, blank=True)

    # Optional link to a separately managed album.
    album_record = models.ForeignKey(
        Album,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="songs"
    )

    language = models.CharField(
        max_length=20,
        choices=LANGUAGE_CHOICES
    )
    mood = models.CharField(
        max_length=20,
        choices=MOOD_CHOICES
    )
    genre = models.CharField(max_length=100, blank=True)
    artwork = models.ImageField(
        upload_to="songs/artwork/",
        blank=True,
        null=True
    )
    audio_file = models.FileField(
        upload_to="songs/audio/",
        blank=True,
        null=True
    )
    duration_seconds = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
