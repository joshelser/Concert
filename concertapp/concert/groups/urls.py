from django.conf.urls.defaults import *

urlpatterns = patterns('concertapp.concert.groups.views',
    url(r'^$', 'groups', name='groups'),
    url(r'^join/(.+)$', 'join_group', name='join_group'),
)
