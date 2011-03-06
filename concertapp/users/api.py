###
#   This file contains the REST api functionality relating to users
###

from tastypie.resources import ModelResource
from concertapp.models import *
from django.contrib.auth.models import User
from concertapp.lib.api import ConcertAuthorization, DjangoAuthentication

from concertapp.lib.api import MyResource

class UserResource(MyResource):
    class Meta:
        queryset = User.objects.all()
        authentication = DjangoAuthentication()
        authorization = ConcertAuthorization()
        fields = ['id', 'username',]

###
#   This resource is for a single user.
###        
class SingleUserResource(UserResource):
    
    class Meta:
        # The user object
        user = None
    
    ###
    #   Must be called before anything is to be retrieved
    ###
    def set_user(self, user):
        self._meta.user = user
        
    def apply_authorization_limits(self, request, object_list):
        user = self._meta.user
        
        object_list = super(SingleUserResource, self).apply_authorization_limits(request, [user])
        
        return object_list
