from django.conf import settings
from django.conf.urls.defaults import *
from django.views.generic.simple import redirect_to
import django.contrib.auth.views
import os

urlpatterns = patterns('',

                       # The default page is the dashboard
                       url(r'^$', redirect_to, {'url': '/dashboard/'}),
                       
                       # Login/logout pages
                       (r'^login/$', 'concertapp.users.views.login_register'),
                       (r'^logout/$', 'django.contrib.auth.views.logout_then_login'),
                       
                       # Password
                       (r'^reset_password/$', 'django.contrib.auth.views.password_reset',
                        {'template_name': 'users/reset_password.html', 
                         'post_reset_redirect':'/login/',
                         }),

                       (r'^reset_pass_confirm/(?P<uidb36>[0-9A-Za-z]+)-(?P<token>.+)/$', 'django.contrib.auth.views.password_reset_confirm'),
                       
                       # Dashboard urls
                       (r'^dashboard/', include('concertapp.dashboard.urls')),
                       
                       # collection urls (manage collections and organize audio)
                       (r'^collections/', include('concertapp.collection.urls')),
                       
                       # audio urls (upload_audio and audio utilities)
                       (r'^audio/', include('concertapp.audio.urls')), 
                       
                       # organize urls (audio organization view, heart of program)
                       (r'^organize/', include('concertapp.organize.urls')),
                       
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
