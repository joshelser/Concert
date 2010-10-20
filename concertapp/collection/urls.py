import os
from django.conf.urls.defaults import *
from django.contrib import admin
from django.conf import settings

from django.views.generic.simple import redirect_to

admin.autodiscover()

## I know it is confusing, but this module is called "collection" because
## "collections" is a reserved word.

urlpatterns = patterns('concertapp.collection.views',
    # /collections goes to /collections/manage
    url(r'^$', redirect_to, {'url': '/collections/manage/'}),

    # Manage collections
    url(r'^manage/$', 'manage_collections', name='manage_collections')
)
