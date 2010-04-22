from django.conf.urls.defaults import *

urlpatterns = patterns('concertapp.audio.views',
    # Audio
    url(r'^$', 'audio', name='audio'),
    url(r'^upload/{0,1}$', 'upload_audio', name='upload_audio'),
    url(r'^(\d+)/{0,1}$', 'view_audio', name='view_audio'),
    url(r'^(\d+)/delete/{0,1}$', 'delete_audio', name='delete_audio'),
    url(r'^(\d+)/(viewer|editor)/waveformsrc/{0,1}$', 'waveform_src', name='waveform_src'), 
    url(r'^(\d+)/waveformsrc/{0,1}$', 'waveform_src', name='waveform_src'), 
    url(r'^(\d+)/audiosrc/{0,1}$', 'audio_src', name='audio_src'),
)
