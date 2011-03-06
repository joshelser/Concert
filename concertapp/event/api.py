###
#   This file contains REST API functionality relating to events
###
from concertapp.collection.api import *
from concertapp.lib.api import MyResource, DjangoAuthentication
from concertapp.models import *
from concertapp.users.api import *
from django.conf.urls.defaults import *
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from tastypie import fields
from tastypie.authentication import Authentication, BasicAuthentication
from tastypie.authorization import DjangoAuthorization, Authorization
from tastypie.http import *
from tastypie.resources import ModelResource, Resource
from tastypie.utils import is_valid_jsonp_callback_value, dict_strip_unicode_keys, trailing_slash
from urlparse import parse_qs

class EventResource(MyResource):
    time = fields.DateTimeField('time')
    collection = fields.ForeignKey(CollectionResource, 'collection')
    
    class Meta:
        authentication = DjangoAuthentication()
        
        queryset = Event.objects.all()
    
class RequestJoinCollectionEventResource(EventResource):
    requesting_user = fields.ForeignKey(UserResource, 'requesting_user')
    
    class Meta:
        authentication = DjangoAuthentication()
        
        queryset = RequestJoinCollectionEvent.objects.all()
    
