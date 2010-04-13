from django.conf.urls.defaults import *

urlpatterns = patterns('concertapp.concert.users.views',
    # Users
    url(r'^$', 'users', name='users'),
    url(r'^add/$', 'create_user', name='create_user'),
    url(r'^login/$', 'login_user', name='login_user'),
    url(r'^logout/$', 'logout_user', name='logout_user'),
    #Groups
    url(r'^(\d+)/groups/$', 'groups', name='groups'),
    url(r'^(\d+)/groups/create$', 'create_group', name='create_group'),
)
