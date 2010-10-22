from django.conf import settings
from django.conf.urls.defaults import *
from django.views.generic.simple import redirect_to
import os

urlpatterns = patterns('concertapp.views',
    # / just redirects to /dashboard, that is the starting page for all users.
    url(r'^$', redirect_to, {'url': '/dashboard/'}),
    url(r'events/(?P<group_id>\d+)/(?P<num_to_return>\d+){0,1}/$',
        'events', name ='events'),    

    # Dashboard urls
    (r'^dashboard/', include('concertapp.dashboard.urls')),
    # collection urls
    (r'^collections/', include('concertapp.collection.urls')),
        
    # Experimental
    url(r'comments/$', 'comments'),
    url(r'users/$', 'users'),
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
            'graphics')})
    )
