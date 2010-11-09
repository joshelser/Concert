from django.conf.urls.defaults import *

urlpatterns = patterns('concertapp.groups.views',
    url(r'^$', 'groups', name='groups'),
    url(r'^join/submit/$', 'request_to_join_group', name='request_to_join_group'),
    url(r'^join/(\d+)/$', 'join_group', name='join_group'),
)
