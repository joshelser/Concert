from django.conf.urls.defaults import *

urlpatterns = patterns('concertapp.views',
    url(r'^$', 'posts', name='posts'),
    # Users
    (r'^users/', include('concertapp.users.urls')),
    # Audio
    (r'^audio/', include('concertapp.audio.urls')),
    # Groups
    (r'^groups/', include('concertapp.groups.urls')),
    # Blog content
    url(r'^add/$','create_post', name='create_post'),
    url(r'^ajaxy_add/$','create_ajaxy_post', name='create_ajaxy_post'),
)
