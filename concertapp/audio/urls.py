import os
from django.conf.urls.defaults import *
from django.contrib import admin
from django.conf import settings

admin.autodiscover()

urlpatterns = patterns('concertapp.audio.views',
    # Upload_audio
    url(r'^upload/$', 'upload_audio', name='upload_audio'),
)
