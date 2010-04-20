from django.conf.urls.defaults import *
from django.conf import settings


urlpatterns = patterns('concertapp.views',
    url(r'^$', 'index', name='index'),
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
        (r'^js/(?P<path>.*)$', 'django.views.static.serve', {'document_root' : settings.STATIC_DOC_ROOT+'/js/'}),
        (r'^css/(?P<path>.*)$', 'django.views.static.serve', {'document_root' : settings.STATIC_DOC_ROOT+'/css/'})
    )

