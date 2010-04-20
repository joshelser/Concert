from django.conf.urls.defaults import *

urlpatterns = patterns('concertapp.audio.views',
    # Audio
    url(r'^$', 'audio', name='audio'),
    url(r'^upload/$', 'upload_audio', name='upload_audio'),
    url(r'^(\d+)/$', 'view_audio', name='view_audio'),
    url(r'^(\d+)/delete/$', 'delete_audio', name='delete_audio'),
    url(r'^(\d+)/waveform/$', 'waveform_image', name='waveform_image'),
    url(r'^(\d+)/audiosrc/$', 'audio_src', name='audio_src'),
)
