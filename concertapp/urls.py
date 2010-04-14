from django.conf.urls.defaults import *

urlpatterns = patterns('concertapp.views',
    url(r'^$', 'index', name='index'),
    # Users
    (r'^users/', include('concertapp.users.urls')),
    # Audio
    (r'^audio/', include('concertapp.audio.urls')),
    # Groups
    (r'^groups/', include('concertapp.groups.urls')),
)
