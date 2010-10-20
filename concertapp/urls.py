import os
from django.conf.urls.defaults import *
from django.contrib import admin
from django.conf import settings

from django.views.generic.simple import redirect_to

admin.autodiscover()

urlpatterns = patterns('concertapp.views',

    # / just redirects to /dashboard, that is the starting page for all users.
    url(r'^$', redirect_to, {'url': '/dashboard/'}),
    
    
    # Dashboard urls
    (r'^dashboard/', include('concertapp.dashboard.urls')),
    # collection urls (manage collections and organize audio)
    (r'^collections/', include('concertapp.collection.urls')),
    # audio urls (upload_audio and audio utilities)
    (r'^audio/', include('concertapp.audio.urls'))
    
    
    
)

if settings.DEBUG:
    urlpatterns += patterns('',
        (r'^media/(?P<path>.*)$', 'django.views.static.serve', 
            {'document_root': settings.MEDIA_ROOT}),
        (r'^js/(?P<path>.*)$', 'django.views.static.serve', 
            {'document_root' : os.path.join(settings.STATIC_DOC_ROOT, 'js')}),
        (r'^css/(?P<path>.*)$', 'django.views.static.serve', 
            {'document_root' : os.path.join(settings.STATIC_DOC_ROOT, 'css')}),
        (r'^graphics/(?P<path>.*)$', 'django.views.static.serve', 
            {'document_root' : os.path.join(settings.STATIC_DOC_ROOT, 
            'graphics')})
    )
