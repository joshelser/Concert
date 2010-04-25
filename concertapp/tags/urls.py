from django.conf.urls.defaults import *

urlpatterns = patterns('concertapp.tags.views',
    # Tags
    url(r'^manage/((?P<message>[^/]+)/){0,1}$', 'manage_tags', name='manage_tags'),
    url(r'^group/(?P<group_id>\d+)/$', 'manage_group_tags', name='manage_group_tags'),
    url(r'^confirmdelete/(?P<tagID>\d+)/$', 'confirm_delete_tag', name='confirm_delete_tag'),
    url(r'^delete/(?P<tagID>\d+)/$', 'delete_tag', name='delete_tag'),
    # Ajax
    url(r'^updateTagName/$', 'update_tag_name', name='update_tag_name'),
    url(r'^getTagSegments/(?P<tagID>\d+)/$', 'get_tag_segments', name='get_tag_segments'),
    
)
