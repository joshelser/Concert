from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.core.cache import cache
from django.utils import simplejson
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core import serializers
from django.core.exceptions import ObjectDoesNotExist

import os, hashlib, tempfile, audiotools, json

from concertapp.models  import *

from concertapp.audio import audioFormats, audioHelpers
from concertapp.audio.waveform import *
from concertapp.settings import MEDIA_ROOT, LOGIN_REDIRECT_URL

from concertapp.decorators import user_is_member_and_collection_exists


###
#   The main organize page for a collection.  This is where we do it all.
#
#   @param  collection_id       Number  -  The id of the collection, populated from
#                               the url.
#   @param  col                 Collection  -    The collection object, passed in
#                               from decorator, so we don't have to query for it
#                               again.
#   @param  user                User - the user object, passed in from decorator  
###
@login_required
@user_is_member_and_collection_exists
def organize_collection(request, collection_id, col, user):
    
    
    files = Audio.objects.filter(collection = col)
    segments = AudioSegment.objects.filter(collection = col)
    
    
    return render_to_response('organize/organize_collection.html', {
        'page_name': 'Organize '+col.name,
        'js_page_path': '/organize/collection/',
        'files': files,
        'segments': segments
    }, RequestContext(request));
    
###
#   This controller produces a list of audio files and audio segments for the
#   audio list panel
###
@login_required
@user_is_member_and_collection_exists
def audio_objects(request, collection_id, col, user):
    
    data = dict()
    
    #   Get all audio objects
    audio_objects = Audio.objects.filter(collection = col)
    
    #   Serialize audio objects
    audio_objects_serialized = serializers.serialize(
            'json',
            audio_objects
    )
    
    # TODO: Fix/Subclass the serializer so we can do this correctly.
    #       Right now we need to de-serialize what we just serialized
    #       so that we can combine it into a larger JSON object to send
    #       to the client, and it wont get treated as a string.
    audio_objects_dict = json.loads(audio_objects_serialized)
    
    #   larger dict object for final serialization
    data['audio_objects'] = audio_objects_dict
    
    #   Get all audio segment objects
    segment_objects = AudioSegment.objects.select_related().filter(collection = col)
    
    #   Serialize all audio segment objects
    segment_objects_serialized = serializers.serialize(
        'json',
        segment_objects
    )
    
    #   De-serialize (TODO: same issue as above)
    segment_objects_dict = json.loads(segment_objects_serialized)
    
    data['segment_objects'] = segment_objects_dict
    
    #   Serialize master object for transport, and send it to client
    data_serialized = simplejson.dumps(data)
    return HttpResponse(data_serialized, content_type='data/json')
    