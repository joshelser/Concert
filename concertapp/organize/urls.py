import os
from django.conf.urls.defaults import *
from django.contrib import admin
from django.conf import settings

admin.autodiscover()

urlpatterns = patterns('concertapp.organize.views',
    #   Organize audio (for a collection)
    url(r'^collection/(?P<collection_id>[\d]+)$', 'organize_collection', name='organize_collection'),
    
    url(r'^collection/(?P<collection_id>[\d]+)/audio$', 'audio_objects', name='audio_objects')
)
