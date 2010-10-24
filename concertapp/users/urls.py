from django.conf.urls.defaults import *

urlpatterns = patterns('concertapp.users.views',
    # Users
#    url(r'^$', 'users', name='users'),
#    url(r'^(\d+)/$', 'view_user', name='view_user'),
    url(r'^add/$', 'create_user', name='create_user'),
    url(r'^login/$', 'login_user', name='login_user'),
#    url(r'^logout/$', 'logout_user', name='logout_user'),
#    url(r'^change_password/$', 'change_password', name='change_password'),
    #Groups
#    url(r'^(\d+)/groups/$', 'groups', name='groups'),
#    url(r'^(\d+)/groups/create/$', 'create_group', name='create_group'),
#    url(r'^(\d+)/groups/manage/$', 'choose_group', name='choose_group'),
#    url(r'^(\d+)/groups/manage/(\d+)/accept_request/(\d+)/submit/$', 'add_to_group', name='add_to_group'),
#    url(r'^(\d+)/groups/manage/(\d+)/accept_request/(\d+)/$', 'accept_request', name='accept_request'),
#    url(r'^(\d+)/groups/manage/(\d+)/pending_requests/$', 'pending_requests', name='pending_requests'),
#    url(r'^(\d+)/groups/manage/(\d+)/remove_user/$', 'remove_user', name='remove_user'),
#    url(r'^(\d+)/groups/manage/(\d+)/remove/(\d+)/submit/$', 'remove_from_group', name='remove_from_group'),
#    url(r'^(\d+)/groups/manage/(\d+)/remove/(\d+)/$', 'remove', name='remove'),
#    url(r'^(\d+)/groups/manage/(\d+)/delete/$', 'delete_confirm', name='delete_confirm'),
#    url(r'^(\d+)/groups/manage/(\d+)/delete/submit/$', 'delete', name='delete'),
#    url(r'^(\d+)/groups/manage/(\d+)/$', 'manage_group', name='manage_group'),
    #ajax
#    url(r'groupselect/$', 'user_group_select', name='user_group_select')

)
