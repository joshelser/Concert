from concertapp.lib.api import *
from concertapp.models import *
from concertapp.users.api import *
from concertapp.audio.api import AudioFileResource
from concertapp.tags.api import TagResource
from django.conf.urls.defaults import *
from django.contrib.auth.models import User
from tastypie import fields
from tastypie.authentication import Authentication, BasicAuthentication
from tastypie.authorization import DjangoAuthorization, Authorization
from tastypie.http import *

###
#   Make sure that the user who is trying to modify the board is the administrator.
###
class AudioSegmentAuthorization(ConcertAuthorization):
    def is_authorized(self, request, object=None):
        if super(AudioSegmentAuthorization, self).is_authorized(request, object):
            #   Get is always allowed, since we're just requesting information about
            #   the collection.
            if request.method == 'GET':
                return True
            
            #   If there is an object to authorize
            if object:
                #   Make sure that the person modifying is in the collection that the audiosegment belongs to.
                return (request.user in object.audioFile.collection.users.all())
            else:
                #   TODO: This currently is always the case (tastypie issues)
                return True
        else:
            return False


class AudioSegmentResource(MyResource):
    creator = fields.ForeignKey(UserResource, 'creator', full=True) 
    audioFile = fields.ForeignKey(AudioFileResource, 'audioFile', full=True)
    tags = fields.ManyToManyField(TagResource, 'tags', full=True)

    class Meta:
        authentication = DjangoAuthentication()
        authorization = AudioSegmentAuthorization()
        
        queryset = AudioSegment.objects.all()

###
#   A resource for audio segments from a single collection
###        
class CollectionAudioSegmentResource(AudioSegmentResource):
    
    class Meta(AudioSegmentResource.Meta):
        collection = None
        
    def set_collection(self, collection):
        self._meta.collection = collection
        
    ###
    #   Only retrieve audio segments for a specific collection
    ###
    def apply_authorization_limits(self, request, object_list):
        if not self._meta.collection:
            raise Exception('You must call set_collection on this resource first')
            
        return super(CollectionAudioSegmentResource, self).apply_authorization_limits(request, object_list.filter(collection=self._meta.collection))
