from concertapp.lib.api import *
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


###
#   Make sure that the user who is trying to modify the board is the administrator.
###
class TagAuthorization(ConcertAuthorization):
    def is_authorized(self, request, object=None):
        
        if super(TagAuthorization, self).is_authorized(request, object):
            #   Get is always allowed, since we're just requesting information about
            #   the collection.
            if request.method == 'GET':
                return True
            
            #   If there is an object to authorize
            if object:
                #   Make sure that the person modifying is in the collection that the tag belongs to.
                return (request.user in object.collection.users.all())
            else:
                #   TODO: This currently is always the case (tastypie issues)
                return True
        else:
            return False

class TagResource(MyResource):
    class Meta:
        authentication = DjangoAuthentication()
        authorization = TagAuthorization()
        
        queryset = Tag.objects.all()

        
    def obj_create(self, bundle, request=None, **kwargs):        
        # Create
        bundle = super(TagResource, self).obj_create(bundle, request, **kwargs)
        
        # If there were no errors creating
        TagCreatedEvent(tag = bundle.obj, collection = bundle.obj.collection).save()
        
        return bundle
        
    def obj_update(self, bundle, request=None, **kwargs):
        
        bundle = super(TagResource, self).obj_update(self, bundle, request, **kwargs)
        
        return bundle

    
