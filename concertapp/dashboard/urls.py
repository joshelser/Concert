import os
from django.conf.urls.defaults import *
from django.contrib import admin
from django.conf import settings

admin.autodiscover()

urlpatterns = patterns('concertapp.dashboard.views',
    #index, just goes to dashboard view
    url(r'^$', 'dashboard', name='dashboard'),
)
