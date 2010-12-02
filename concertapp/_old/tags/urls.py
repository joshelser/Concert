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
    url(r'^addTagToSegment/(?P<groupID>\d+)/(?P<segmentID>\d+)/(?P<tag>[^/]+)/$', 'add_tag_to_segment', name='add_tag_to_segment'),
    
    ##Temp Don't know if tagcomments will be accessed by ajax or directly yet
    #eventually this line will be under one of the above commented sections
    url(r'^comment/(?P<tagID>\d+)/(?P<groupID>\d+)/$', 'comment', name='comment'),
    
    
    
)
