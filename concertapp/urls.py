from django.conf import settings
from django.conf.urls.defaults import *
from django.views.generic.simple import redirect_to
import django.contrib.auth.views
import os

urlpatterns = patterns('',

                       url(r'^$', redirect_to, {'url': '/dashboard/'}),
                       (r'^login/$', 'django.contrib.auth.views.login', {'template_name': 'login.html'}),
                       (r'^logout/$', 'django.contrib.auth.views.logout_then_login'),
                       
                       # Dashboard urls
                       (r'^dashboard/', include('concertapp.dashboard.urls')),

                       # collection urls (manage collections and organize audio)
                       (r'^collections/', include('concertapp.collection.urls')),

                       # audio urls (upload_audio and audio utilities)
                       (r'^audio/', include('concertapp.audio.urls')), 
                      
                       )






if settings.DEBUG:
    urlpatterns += patterns('',
                            (r'^media/(?P<path>.*)$', 'django.views.static.serve', 
                             {'document_root': settings.MEDIA_ROOT}),
                            (r'^js/(?P<path>.*)$', 'django.views.static.serve', 
                             {'document_root' : os.path.join(settings.STATIC_DOC_ROOT, 'js')}),
                            (r'^css/(?P<path>.*)$', 'django.views.static.serve', 
                             {'document_root' : os.path.join(settings.STATIC_DOC_ROOT, 'css')}),
                            (r'^graphics/(?P<path>.*)$', 'django.views.static.serve', 
                             {'document_root' : os.path.join(settings.STATIC_DOC_ROOT, 
                                                             'graphics')}),
                            (r'^paths/(?P<path>.*)$', 'django.views.static.serve', 
                             {'document_root' : os.path.join(settings.STATIC_DOC_ROOT, 
                                                             'paths')})
                            
                            )
