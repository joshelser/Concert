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
    #   JSON/AJAX
    ###
    # Search collections
    url(r'^search/(?P<query>.+)/$', 'search_collections', name='search_collections'),
    # Info for collection
    url(r'^info/(?P<collection_id>\d+)/$', 'collection_info', name='collection_info'),
    # User joins collection
    url(r'^join/(?P<collection_id>\d+)/$', 'join_collection', name='join_collection'),
    # User revokes join request
    url(r'^revoke/(?P<collection_id>\d+)/$', 'revoke_request', name='revoke_request'),
    # Administrator denies join request
    url(r'^deny/(?P<collection_id>\d+)/(?P<user_id>\d+)/$', 'deny_request', name='deny_request'),
    # Administrator approves join request
    url(r'^approve/(?P<collection_id>\d+)/(?P<user_id>\d+)/$', 'approve_request', name='approve_request'),
)
