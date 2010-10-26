import os
from django.conf.urls.defaults import *
from django.contrib import admin
from django.conf import settings

from django.views.generic.simple import redirect_to

admin.autodiscover()

## I know it is confusing, but this module is called "collection" because
## "collections" is a reserved word.

urlpatterns = patterns('concertapp.collection.views',
    # /collections goes to Manage collections
    url(r'^$', 'manage_collections', name='manage_collections'),

    # Add new collection
    url(r'^add/$', 'create_collection', name='create_collection'),
    
    # Delete collection
    url(r'^delete/$', 'delete_collection', name='delete_collection'),
    
    # retrieve collections
    url(r'^user/$', 'user_collections', name='user_collections'),
    
    ###
    #   JSON
    ###
    # Search collections
    url(r'^search/(?P<query>.+)/$', 'search_collections', name='search_collections'),
)
