from django.conf.urls.defaults import *

urlpatterns = patterns('concertapp.concert.views',
    url(r'^login$', 'dumb_login', name='login'),
    url(r'^logout$', 'dumb_logout', name='logout'),
    url(r'^register$', 'dumb_registration', name='registration'),
    url(r'^$', 'posts', name='posts'),
    #Groups
    url(r'^groups/$', 'groups', name='groups'),
    url(r'^groups/create$', 'create_group', name='create_group'),
    # Users
    (r'^users/', include('concertapp.concert.users.urls')),
    # Audio
    (r'^audio/', include('concertapp.concert.audio.urls')),
    # Blog content
    url(r'^add/$','create_post', name='create_post'),
    url(r'^ajaxy_add/$','create_ajaxy_post', name='create_ajaxy_post'),
)
