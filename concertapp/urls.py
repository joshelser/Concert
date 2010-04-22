from django.conf.urls.defaults import *
from django.conf import settings
import os


urlpatterns = patterns('concertapp.views',
    #user_viewable_pages
    
    #index
    url(r'^$', 'index', name='index'),
    #edit
    url(r'edit/(?P<segment_id>\d+)/{0,1}$', 'edit', name='edit'),
    #admin
    url(r'admin/{0,1}$', 'admin', name='admin'),
    
    
    #functional_pages
    
    # Users
    (r'^users/', include('concertapp.users.urls')),
    # Audio
    (r'^audio/', include('concertapp.audio.urls')),
    # Groups
    (r'^groups/', include('concertapp.groups.urls')),

)

if settings.DEBUG:
    urlpatterns += patterns('',
        (r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
        (r'^js/(?P<path>.*)$', 'django.views.static.serve', {'document_root' : os.path.join(settings.STATIC_DOC_ROOT, 'js')}),
        (r'^css/(?P<path>.*)$', 'django.views.static.serve', {'document_root' : os.path.join(settings.STATIC_DOC_ROOT, 'css')}),
        (r'^graphics/(?P<path>.*)$', 'django.views.static.serve', {'document_root' : os.path.join(settings.STATIC_DOC_ROOT, 'graphics')})
    )

