from concertapp.lib.api import *
from concertapp.models import *
from concertapp.users.api import *
from concertapp.collection.api import CollectionResource
from django.conf.urls.defaults import *
from django.contrib.auth.models import User
from tastypie import fields
from tastypie.authentication import Authentication, BasicAuthentication
from tastypie.authorization import DjangoAuthorization, Authorization
from tastypie.http import *

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
    creator = fields.ForeignKey(UserResource, 'creator', full=True)
    collection = fields.ForeignKey(CollectionResource, "collection", full = True)


    class Meta:
        authentication = DjangoAuthentication()
        authorization = TagAuthorization()
        
        queryset = Tag.objects.all()
        
    def obj_create(self, bundle, request=None, **kwargs):        
        return super(TagResource, self).obj_create(bundle, request, **kwargs)

    # right now tag events are still created in the model.
    # TODO: decide if this is correct
    #     # If there were no errors creating
    #     #TagCreatedEvent.objects.create(tag = bundle.obj, collection = bundle.obj.collection)
    
    #     return bundle
        

    
    
