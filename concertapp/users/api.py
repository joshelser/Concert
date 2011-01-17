###
#   This file contains the REST api functionality relating to users
###

from tastypie.resources import ModelResource
from concertapp.models import *
from django.contrib.auth.models import User

from concertapp.collection.api import *

class UserResource(MyResource):
    class Meta:
        queryset = User.objects.all()
        fields = ['id', 'username',]
        allowed_methods = ['get']