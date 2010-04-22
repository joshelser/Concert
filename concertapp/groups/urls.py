from django.conf.urls.defaults import *

urlpatterns = patterns('concertapp.groups.views',
    url(r'^$', 'groups', name='groups'),
    url(r'^join/submit/{0,1}$', 'request_to_join_group', name='request_to_join_group'),
    url(r'^join/(\d+)/{0,1}$', 'join_group', name='join_group'),
)
