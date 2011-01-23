import os
from django.conf.urls.defaults import *
from django.contrib import admin
from django.conf import settings
from django.views.generic.simple import redirect_to

from concertapp.collection.api import CollectionResource

admin.autodiscover()


## I know it is confusing, but this module is called "collection" because
## "collections" is a reserved word.

urlpatterns = patterns('concertapp.collection.views',
    # /collections goes to Manage collections
    url(r'^$', 'manage_collections', name='manage_collections'),
        
    ###
    #   JSON/AJAX
    ###
    # Search collections
    url(r'^search/(?P<query>.+)/$', 'search_collections', name='search_collections'),
)
