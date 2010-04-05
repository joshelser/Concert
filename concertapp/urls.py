from django.conf.urls.defaults import *
from django.contrib import admin
from django.conf import settings

admin.autodiscover()

urlpatterns = patterns('',
    (r'^concert/', include('concertapp.concert.urls')),
    (r'^concert/api/', include('concertapp.api.urls')),
    (r'^concert/admin/(.*)', admin.site.root),
    
    (r'^concert/accounts/login/$', 'django.contrib.auth.views.login'),
    (r'^concert/accounts/logout/$', 'django.contrib.auth.views.logout'),
)
