from django.conf.urls.defaults import *

urlpatterns = patterns('concertapp.concert.views',
    url(r'^$', 'posts', name='posts'),
    url(r'^users/$', 'users', name='users'),
    url(r'^users/add/$', 'create_user', name='create_user'),
    url(r'^add/$','create_post', name='create_post'),
    url(r'^ajaxy_add/$','create_ajaxy_post', name='create_ajaxy_post'),
)
