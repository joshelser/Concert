###
#   This file contains the REST API functionality relating to collections.
###


from tastypie.resources import ModelResource, Resource
from tastypie import fields
from tastypie.authorization import DjangoAuthorization, Authorization
from tastypie.authentication import Authentication, BasicAuthentication

from tastypie.utils import is_valid_jsonp_callback_value, dict_strip_unicode_keys, trailing_slash
from tastypie.http import *

from django.core.exceptions import ObjectDoesNotExist

from urlparse import parse_qs

from concertapp.models import *
from django.contrib.auth.models import User

from concertapp.users.api import *



class DjangoAuthentication(Authentication):
    """Authenticate based upon Django session"""
    def is_authenticated(self, request, **kwargs):
        return request.user.is_authenticated()


###
#   This is soley to provide the to_dict function.  Once I figure out what a better
#   way to do this is, we can remove this class.
###
class MyResource(ModelResource):
    ###
    #   This method is used to bootstrap the objects into place.
    ###
    def as_dict(self, request):
        cols = self.get_object_list(request)

        colsBundles = [self.full_dehydrate(obj=obj) for obj in cols]

        colsSerialized = [obj.data for obj in colsBundles]

        return colsSerialized
        
    ###
    #   This method returns the serialized object upon creation, instead of 
    #   just the uri to it.
    ###
    def post_list(self, request, **kwargs):
       deserialized = self.deserialize(request,
                                       request.raw_post_data,
                                       format=request.META.get('CONTENT_TYPE',
                                                               'application/json'))
       bundle = self.build_bundle(data=dict_strip_unicode_keys(deserialized))
       self.is_valid(bundle, request)
       updated_bundle = self.obj_create(bundle, request=request)
       resp = self.create_response(request,
                                   self.full_dehydrate(updated_bundle.obj))
       resp['location'] = self.get_resource_uri(updated_bundle)
       resp.code = 201
       return resp                              
    
    
        

###
#   This is the resource that is used for a collection.
###
class CollectionResource(MyResource):
    users = fields.ManyToManyField(UserResource, 'users')
    
    class Meta:
        authentication = DjangoAuthentication()
        queryset = Collection.objects.all()
        
        # For when we need to filter the resource programatically (not sure how to
        # do this otherwise)
        search_term = None
        
        filtering = {
            'name': ('contains','icontains',)
        }
        
        authorization = DjangoAuthorization()
    
    ###
    #   Used to set the current search term from the outside.  This should not 
    #   be done like this, but our search is not too robust right now in either case.
    ###
    def set_search_term(self, term):
        self._meta.search_term = term
        
    ###
    #   Before sending object out, add the number of users so it doesn't have to 
    #   be calculated on client-side
    ###
    def dehydrate(self, bundle):
        
        userCount = len(bundle.data['users'])
        
        bundle.data['num_users'] = userCount
        
        
        return bundle
        
        
    ###
    #   Make sure the user is an admin if they are trying to modify or delete the 
    #   collection.
    ###
    def apply_authorization_limits(self, request, object_list):
        user = request.user
        
        method = request.META['REQUEST_METHOD']
        
        # If user is just trying to delete or update the collection:
        if method == 'DELETE' or method == 'PUT':
            # User must be an administrator of the collection
            object_list = super(CollectionResource, self).apply_authorization_limits(request, user.collection_set.filter(admin=user))
  
        elif method == 'GET' and self._meta.search_term:
            # Filter by search term
            object_list = super(CollectionResource, self).apply_authorization_limits(request, user.collection_set.filter(name__icontains=self._meta.search_term))
        
        return object_list
    
    ###
    #   When creating a new collection
    ###
    def obj_create(self, bundle, request, **kwargs):
        # Be sure that the current user will be sent in as the admin of the group
        kwargs['admin'] = request.user
        
        # Do magic
        bundle = super(CollectionResource, self).obj_create(bundle, request, **kwargs)
                
        # Now we can call our init method
        bundle.obj.init() 
        
        return bundle

    
    

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
#   This resource is for collections which the user is a member, but is not the
#   administrator.
###
class MemberNotAdminCollectionResource(CollectionResource):
    
    ###
    #   Make sure the user is not an admin
    ###
    def apply_authorization_limits(self, request, object_list):
        
        user = request.user
        
        # Here we ignore the incomming argument, and only send forth the
        # collections that the user is a member of.        
        object_list = super(MemberNotAdminCollectionResource, self).apply_authorization_limits(request, user.collection_set.exclude(admin=user))
        
        return object_list
        
###
#   This resource is only for collections which the user is an administrator of.
###
class AdminCollectionResource(CollectionResource):
    
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
class CollectionRequestResource(CollectionResource):
    
    ###
    #   Retrieve only the collections for which the user has sent join requests
    ###
    def apply_authorization_limits(self, request, object_list):
        user = request.user
        
        # Ignore argument, just get collections that user has requested to join
        object_list = super(UserCollectionRequestResource, self).apply_authorization_limits(request, user.collection_join_requests.all())
        
        return object_list
        
        
###
#   This is the resource that is used for a collection request.
###
class RequestResource(MyResource):
    

    class Meta:
        queryset = Request.objects.all()

        authorization = DjangoAuthorization()
        authentication = DjangoAuthentication()


###
#   This is the resource that is used for collection requests from a single
#   user.
###
class UserRequestResource(RequestResource):

    ###
    #   Make sure the user is the one who made the request
    ###
    def apply_authorization_limits(self, request, object_list):
        
        user = request.user
        
        # Here we ignore the incomming argument, and only send forth the
        # requests for this user
        object_list = super(UserRequestResource, self).apply_authorization_limits(request, user.request_set.all())
        
        return object_list


