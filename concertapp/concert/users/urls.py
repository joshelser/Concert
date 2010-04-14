from django.conf.urls.defaults import *

urlpatterns = patterns('concertapp.concert.users.views',
    # Users
    url(r'^$', 'users', name='users'),
    url(r'^(\d+)/$', 'view_user', name='view_user'),
    url(r'^add/$', 'create_user', name='create_user'),
    url(r'^login/$', 'login_user', name='login_user'),
    url(r'^logout/$', 'logout_user', name='logout_user'),
    url(r'^change_password/$', 'change_password', name='change_password'),
    #Groups
    url(r'^(\d+)/groups/$', 'groups', name='groups'),
    url(r'^(\d+)/groups/create$', 'create_group', name='create_group'),
    url(r'^(\d+)/groups/manage/$', 'choose_group', name='choose_group'),
    url(r'^(\d+)/groups/manage/(.+)/accept_request/(.+)/submit/$', 'add_to_group', name='add_to_group'),
    url(r'^(\d+)/groups/manage/(.+)/accept_request/(.+)/$', 'accept_request', name='accept_request'),
    url(r'^(\d+)/groups/manage/(.+)/pending_requests/$', 'pending_requests', name='pending_requests'),
    url(r'^(\d+)/groups/manage/(.+)/$', 'manage_group', name='manage_group')

)
