from concertapp.lib.api import ConcertAuthorization, MyResource,DjangoAuthentication
from concertapp.models import Audio
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
class AudioAuthorization(ConcertAuthorization):
    def is_authorized(self, request, object=None):
        
        if super(AudioAuthorization, self).is_authorized(request, object):
            
            #   If there is an object to authorize
            if object:
                #   Make sure that the person modifying is in the collection that the audio object
                #   belongs to.
                return (request.user in object.collection.users.all())
            else:
                #   TODO: This currently is always the case (tastypie issues)
                return True
        else:
            return False

class AudioResource(MyResource):
    uploader = fields.ForeignKey(UserResource, 'uploader', full=True)
    collection = fields.ForeignKey(CollectionResource, "collection", full = True)

    class Meta:
        authentication = DjangoAuthentication()
        authorization = AudioAuthorization()
        
        queryset = Audio.objects.all()        

        allowed_methods = ['get','put','delete']
    
        excludes = ['wavfile','oggfile','mp3file','waveformViewer','waveformEditor']
