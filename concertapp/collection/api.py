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

from concertapp.lib.api import *

from concertapp.users.api import *


class ConcertAuthorization(Authorization):
    def is_authorized(self, request, object=None):
        #   User must be logged in, authentication backend should have set
        #   request.user
        if not hasattr(request, 'user'):
            return False
            
        return True
        


###
#   Make sure that the user who is trying to modify the board is the administrator.
###
class CollectionAuthorization(ConcertAuthorization):
    def is_authorized(self, request, object=None):
        
        if super(CollectionAuthorization, self).is_authorized(request, object):
            #   Get is always allowed, since we're just requesting information about
            #   the collection.
            if request.method == 'GET':
                return True
            
            
            #   If there is an object to authorize
            if object:
                #   Make sure that we're the administrator
                return (request.user == object.admin)
            else:
                #   TODO: This currently is always the case (tastypie issues)
                return True
        else:
            return False
            
###
#   Make sure that the user who is trying to access/modify a request is either
#   the creator of that request, or the administrator of the collection.
###
class RequestAuthorization(ConcertAuthorization):
    def is_authorized(self, request, object=None):
        
        if super(RequestAuthorization, self).is_authorized(request, object):
            user = request.user
            
            # If we have an object to authenticate
            if object:
                # If the user is the one who made this request
                if user == object.user:
                    return True
                # or the user is the administrator of the collection
                elif user == object.collection.admin:
                    return True
                else:
                    return False
            else:
                # TODO: This is always the case (tastypie issues)
                return True
            
        else:
            # not authorized by django
            return False

###
#   This is the resource that is used for a collection.
###
class CollectionResource(MyResource):
    
    users = fields.ManyToManyField(UserResource, 'users')
    
    class Meta:
        authentication = DjangoAuthentication()
        authorization = CollectionAuthorization()
        queryset = Collection.objects.all()
        
        # For when we need to filter the resource programatically (not sure how to
        # do this otherwise)
        search_term = None
        
        filtering = {
            'name': ('contains','icontains',)
        }
        
    
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
  
        else:
            # Filter by search term if there is one
            try:                
                search_term = self._meta.search_term
                if search_term:
                    object_list = super(CollectionResource, self).apply_authorization_limits(request, object_list.filter(name__icontains=self._meta.search_term))
                else:
                    object_list = super(CollectionResource, self).apply_authorization_limits(request, object_list)
            except AttributeError, e:
                object_list = super(CollectionResource, self).apply_authorization_limits(request, object_list)

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
    
    class Meta:
        # The user which we are referring to.  This must be set before
        #   the collection is to be retrieved.
        user = None
        
    def set_user(self, user):
        self._meta.user = user
        
    ###
    #   Make sure the user is a member of the collections
    ###
    def apply_authorization_limits(self, request, object_list):
        
        if self._meta.user:
            user = self._meta.user
        else:
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
        
        self._meta.request = request
        
        user = request.user
        
        # Again, ignore incomming argument and only send forth the
        # collections that the user is an administrator of.
        object_list = super(AdminCollectionResource, self).apply_authorization_limits(request, user.collection_set.filter(admin=user))
        
        return object_list

    ###
    #   Here, before the object is sent for serialization we will add the 
    #   requests.
    ###
    def full_dehydrate(self, obj):

        dehydrated = super(AdminCollectionResource, self).full_dehydrate(obj)
        
        # Get all requests for this collection
        r = CollectionRequestResource()
        r.set_collection(obj)
        
        dehydrated.data['requests'] = r.as_dict(self._meta.request)
        
        return dehydrated
        
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
    user = fields.ForeignKey(UserResource, 'user', full=True)
    collection = fields.ForeignKey(CollectionResource, 'collection')

    class Meta:
        queryset = Request.objects.all()

        authorization = RequestAuthorization()
        authentication = DjangoAuthentication()


###
#   This is the resource that is used for collection requests from a single
#   user.
###
class UserRequestResource(MyResource):
    collection = fields.ForeignKey(CollectionResource, 'collection', full=True)

    class Meta:
        queryset = Request.objects.all()

        authorization = RequestAuthorization()
        authentication = DjangoAuthentication()

    ###
    #   Make sure the user is the one who made the request
    ###
    def apply_authorization_limits(self, request, object_list):
        
        user = request.user
        
        # Here we ignore the incomming argument, and only send forth the
        # requests for this user
        object_list = super(UserRequestResource, self).apply_authorization_limits(request, user.request_set.all())
        
        return object_list
        
###
#   This is a resource that is used for the requests from a single collection.
###
class CollectionRequestResource(RequestResource):
    
    
    class Meta:
        # The collection for which we will retrieve these requests
        collection = None
        
    ###
    #   This must be called before retreving the requests
    ###
    def set_collection(self, collection):
        self._meta.collection = collection
        
    ###
    #   When retrieving the requests, only get those from our specified collection.
    ###
    def apply_authorization_limits(self, request, object_list):
        collection = self._meta.collection
        
        object_list = super(CollectionRequestResource, self).apply_authorization_limits(request, Request.objects.filter(collection=collection))
        
        return object_list
        
