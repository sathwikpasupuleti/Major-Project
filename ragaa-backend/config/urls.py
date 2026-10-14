from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("music.urls")),
]

if settings.DEBUG:
    urlpatterns += static(
        "media/",
        document_root=settings.BASE_DIR
    )