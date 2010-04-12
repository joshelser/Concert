from django.conf.urls.defaults import *
from piston.resource import Resource
from piston.authentication import HttpBasicAuthentication

from piston.doc import documentation_view

from concertapp.api.handlers import BlogpostHandler

basic_auth = HttpBasicAuthentication(realm='My sample API')
#django_auth = DjangoAuthentication()

basic_blogposts = Resource(handler=BlogpostHandler, authentication=basic_auth)
#django_blogposts = Resource(handler=BlogpostHandler, authentication=django_auth)

urlpatterns = patterns('',
    url(r'^basic_auth/posts/$', basic_blogposts, name="posts"),
    url(r'^basic_auth/post/(?P<id>.+)/$', basic_blogposts, name="post"),
    
#    url(r'^django_auth/posts/$', django_blogposts, name="posts"),
#    url(r'^django_auth/post/(?P<id>.+)/$', django_blogposts, name="post"),
    
    

    # automated documentation
    url(r'^$', documentation_view),
)
