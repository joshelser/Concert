###
#   This file contains REST API functionality relating to events
###

from tastypie.resources import ModelResource, Resource
from tastypie import fields
from tastypie.authorization import DjangoAuthorization, Authorization
from tastypie.authentication import Authentication, BasicAuthentication

from tastypie.utils import is_valid_jsonp_callback_value, dict_strip_unicode_keys, trailing_slash
from tastypie.http import *

from django.core.exceptions import ObjectDoesNotExist
from django.conf.urls.defaults import *

from urlparse import parse_qs

from concertapp.models import *
from django.contrib.auth.models import User

from concertapp.lib.api import *
from concertapp.users.api import *
from concertapp.collection.api import *

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
    
