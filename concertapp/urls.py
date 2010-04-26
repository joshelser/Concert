from django.conf.urls.defaults import *
from django.conf import settings
import os


urlpatterns = patterns('concertapp.views',
    #top_level
    
    #index
    url(r'^$', 'index', name='index'),
    #edit
    url(r'^edit/(?P<segment_id>\d+)/(?P<group_id>\d+)/$', 'edit', 
        name='edit'),
    url(r'^edit/submit$',
        'new_segment_submit', name='submit'),
    #admin
    url(r'^admin/', 'admin', name='admin'),
    #delete
    url(r'^delete_segment/(?P<segment_id>\d+)/$', 'delete_segment', 
        name='delete_segment'),
    #rename
    url(r'^rename_segment/$', 'rename_segment', 
        name='rename_segment'),
    
    
    #nested
    # Users
    (r'^users/', include('concertapp.users.urls')),
    (r'^users/$', include('concertapp.users.urls')),
    # Audio
    (r'^audio/', include('concertapp.audio.urls')),
    (r'^audio/$', include('concertapp.audio.urls')),
    # Groups
    (r'^groups/', include('concertapp.groups.urls')),
    (r'^groups/$', include('concertapp.groups.urls')),
    # Tag operations
    (r'^tags/', include('concertapp.tags.urls')),
    (r'^tags/$', include('concertapp.tags.urls')),

)

if settings.DEBUG:
    urlpatterns += patterns('',
        (r'^media/(?P<path>.*)$', 'django.views.static.serve', 
            {'document_root': settings.MEDIA_ROOT}),
        (r'^js/(?P<path>.*)$', 'django.views.static.serve', 
            {'document_root' : os.path.join(settings.STATIC_DOC_ROOT, 'js')}),
        (r'^css/(?P<path>.*)$', 'django.views.static.serve', 
            {'document_root' : os.path.join(settings.STATIC_DOC_ROOT, 'css')}),
        (r'^graphics/(?P<path>.*)$', 'django.views.static.serve', {'document_root' : os.path.join(settings.STATIC_DOC_ROOT, 'graphics')})
    )

