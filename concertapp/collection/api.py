###
#   This file contains the REST API functionality relating to collections.
###


from tastypie.resources import ModelResource, Resource
from tastypie import fields
from tastypie.authorization import DjangoAuthorization
from tastypie.authentication import BasicAuthentication

from concertapp.models import *
from django.contrib.auth.models import User

from concertapp.users.api import *



###
#   This is the resource that is used for a collection.
###
class CollectionResource(ModelResource):
    users = fields.ManyToManyField(UserResource, 'users')
    
    class Meta:
        queryset = Collection.objects.all()
        
        filtering = {
            'name': ('contains',)
        }
        
        authentication = BasicAuthentication()
        authorization = DjangoAuthorization()
        
    ###
    #   Before sending object out, add the number of users so it doesn't have to 
    #   be calculated on client-side
    ###
    def dehydrate(self, bundle):
        
        userCount = len(bundle.data['users'])
        
        bundle.data['num_users'] = userCount
        
        return bundle
        
    ###
    #   This method is used to bootstrap the objects into place.
    ###
    def as_dict(self, request):
        cols = self.get_object_list(request)

        colsBundles = [self.full_dehydrate(obj=obj) for obj in cols]

        colsSerialized = [obj.data for obj in colsBundles]

        return colsSerialized
    

###
#   This resource is only for collections which the user is a member of.  This
#   includes collections for which the user is an administrator.
###        
class MemberCollectionResource(CollectionResource):
    
    ###
    #   Make sure the user is a member of the collections
    ###
    def apply_authorization_limits(self, request, object_list):
        
        user = request.user
        
        # Here we ignore the incomming argument, and only send forth the
        # collections that the user is a member of.        
        object_list = super(MemberCollectionResource, self).apply_authorization_limits(request, user.collection_set.all())
        
        return object_list
        
        
###
#   This resource is only for collections which the user is an administrator of.
###
class AdminCollectionResource(CollectionResource):
    
    requesting_users = fields.ManyToManyField(UserResource, 'requesting_users')
    
    ###
    #   Retrieve only the collections for which the user is an administrator
    ###
    def apply_authorization_limits(self, request, object_list):
        user = request.user
        
        # Again, ignore incomming argument and only send forth the
        # collections that the user is an administrator of.
        object_list = super(AdminCollectionResource, self).apply_authorization_limits(request, user.collection_set.filter(admin=user))
        
        return object_list
        
###
#   This resource is for collections that a user has requested to join.
###
class UserCollectionRequestResource(CollectionResource):
    
    ###
    #   Retrieve only the collections for which the user has sent join requests
    ###
    def apply_authorization_limits(self, request, object_list):
        user = request.user
        
        # Ignore argument, just get collections that user has requested to join
        object_list = super(UserCollectionRequestResource, self).apply_authorization_limits(request, user.collection_join_requests.all())
        
        return object_list
        
        
