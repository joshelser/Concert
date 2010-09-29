from django.conf.urls.defaults import *

urlpatterns = patterns('concertapp.audio.views',
    # Audio
    url(r'^$', 'audio', name='audio'),
    url(r'^upload/$', 'upload_audio', name='upload_audio'),
    url(r'^(\d+)/$', 'view_audio', name='view_audio'),
    url(r'^(\d+)/delete/$', 'delete_audio', name='delete_audio'),
    url(r'^(\d+)/(viewer|editor)/waveformsrc/$', 'waveform_src', name='waveform_src'), 
    url(r'^(\d+)/waveformsrc/$', 'waveform_src', name='waveform_src'), 
    url(r'^(\d+)/audiosrc/(wav|mp3|ogg)/$', 'audio_src', name='audio_src'),
    url(r'^addsegmenttogroup/(?P<segment_id>\d+)/(?P<group_id>\d+)/$', 'add_segment_to_group', name='add_segment_to_group'),
)
