###
#   This file contains the REST api functionality relating to users
###

from tastypie.resources import ModelResource
from concertapp.models import *
from django.contrib.auth.models import User


class UserResource(ModelResource):
    class Meta:
        queryset = User.objects.all()