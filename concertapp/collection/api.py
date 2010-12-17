###
#   This file contains the REST API functionality relating to collections.
###


from tastypie.resources import ModelResource
from tastypie import fields

from concertapp.models import *
from django.contrib.auth.models import User

from concertapp.users.api import *

class CollectionResource(ModelResource):
    admin = fields.ForeignKey(UserResource, 'admin')
    
    class Meta:
        queryset = Collection.objects.all()