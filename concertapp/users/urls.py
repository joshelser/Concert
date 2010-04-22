from django.conf.urls.defaults import *

urlpatterns = patterns('concertapp.users.views',
    # Users
    url(r'^$', 'users', name='users'),
    url(r'^(\d+)/{0,1}$', 'view_user', name='view_user'),
    url(r'^add/{0,1}$', 'create_user', name='create_user'),
    url(r'^login/{0,1}$', 'login_user', name='login_user'),
    url(r'^logout/{0,1}$', 'logout_user', name='logout_user'),
    url(r'^change_password/{0,1}$', 'change_password', name='change_password'),
    #Groups
    url(r'^(\d+)/groups/{0,1}$', 'groups', name='groups'),
    url(r'^(\d+)/groups/create/{0,1}$', 'create_group', name='create_group'),
    url(r'^(\d+)/groups/manage/{0,1}$', 'choose_group', name='choose_group'),
    url(r'^(\d+)/groups/manage/(\d+)/accept_request/(\d+)/submit/{0,1}$', 'add_to_group', name='add_to_group'),
    url(r'^(\d+)/groups/manage/(\d+)/accept_request/(\d+)/{0,1}$', 'accept_request', name='accept_request'),
    url(r'^(\d+)/groups/manage/(\d+)/pending_requests/{0,1}$', 'pending_requests', name='pending_requests'),
    url(r'^(\d+)/groups/manage/(\d+)/remove_user/{0,1}$', 'remove_user', name='remove_user'),
    url(r'^(\d+)/groups/manage/(\d+)/remove/(.+)/submit/{0,1}$', 'remove_from_group', name='remove_from_group'),
    url(r'^(\d+)/groups/manage/(\d+)/remove/(.+)/{0,1}$', 'remove', name='remove'),
    url(r'^(\d+)/groups/manage/(\d+)/{0,1}$', 'manage_group', name='manage_group')

)
