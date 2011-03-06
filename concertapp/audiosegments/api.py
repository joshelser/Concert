from concertapp.lib.api import NestedResource, ConcertAuthorization, DjangoAuthentication
from concertapp.models import *
from concertapp.users.api import *
from concertapp.audio.api import AudioResource
from django.conf.urls.defaults import *
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from tastypie import fields
from tastypie.authentication import Authentication, BasicAuthentication
from tastypie.authorization import DjangoAuthorization, Authorization
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.http import *
from tastypie.utils import trailing_slash
import re

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
                return (request.user in object.audio.collection.users.all())
            else:
                #   TODO: This currently is always the case (tastypie issues)
                return True
        else:
            return False


class AudioSegmentResource(NestedResource):
    creator = fields.ForeignKey(UserResource, 'creator', full=True) 
    audio = fields.ForeignKey(AudioResource, 'audio', full=True)
    tags = fields.ToManyField("concertapp.tags.api.TagResource","tags", null = True)

    class Meta:
        authentication = DjangoAuthentication()
        authorization = AudioSegmentAuthorization()
        queryset = AudioSegment.objects.all()
        
        filtering = {
            "tags": ALL
            }

        nested = 'tags'
'''
    def dispatch(self, request_type, request, **kwargs):
        if 'nested_pk' in kwargs:
            nested_pk = kwargs.pop('nested_pk')
            kwargs['tags'] = get_object_or_404(Tag, pk=nested_pk)

        return super(AudioSegmentResource, self).dispatch(request_type, request, **kwargs)


    def obj_create(self, bundle, request=None, **kwargs):
        new_bundle = super(AudioSegmentResource, self).obj_create(bundle, request, **kwargs)
        
        if request.META['PATH_INFO'] and re.search('tag/\d+/+.+', request.META['PATH_INFO']):
            match = re.search('tag/(\d+)/+.+', request.META['PATH_INFO'])
            tag_id = match.group(1)
            tag = Tag.objects.get(pk = tag_id)
            new_bundle.obj.tags.add(tag)
            
        return new_bundle

    def obj_update(self, bundle, request=None, **kwargs):
        # Todo: much...
        return super(AudioSegmentResource, self).obj_update(bundle, request, **kwargs)
     

    def override_urls(self):
        override_urls = []

        override_urls.append(
            url(r"^(?P<resource_name>%s)/(?P<pk>\w[\w-]*?)/(?P<nested_resource_name>%s)/(?P<nested_pk>\w[\w/-]*?)%s$" % (self._meta.resource_name, 'tag', trailing_slash()), 
             self.wrap_view('dispatch_detail'))
            )
        
        return override_urls

'''
