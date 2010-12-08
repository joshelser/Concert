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
    
    data = {
        'collections': user.get_profile().get_collections_dict(), 
    }
    
    
    files = Audio.objects.filter(collection = col)
    segments = AudioSegment.objects.filter(audio__collection = col)
    
    
    return render_to_response('organize/organize_collection.html', {
        'page_name': 'Organize '+ col.name,
        'js_page_path': '/organize/collection/',
        'files': files,
        'segments': segments,
        'data': simplejson.dumps(data),         
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
    
    #   Create list  of audio objects
    audio_objects_dicts = list()
    
    for audio in audio_objects:
        
        audio_dict = dict({
            'id': audio.id, 
            'name': audio.name, 
            'uploader': {
                'id': audio.uploader.id, 
                'username': audio.uploader.username, 
            }, 
            'oggfile': audio.oggfile.url, 
            'mp3file': audio.mp3file.url, 
            'waveformViewer': audio.waveformViewer.url, 
            'waveformEditor': audio.waveformEditor.url,
            # We will populate this client-side (we have to loop through them anyway)
            'segments': list()
        })
        
        audio_objects_dicts.append(audio_dict)
        
            
    #   put into larger dict object for final serialization
    data['audio_objects'] = audio_objects_dicts
    
    #   Get all audio segment objects
    segment_objects = AudioSegment.objects.select_related().filter(audio__collection = col)
    
    #   Create list of audio segment objects (as dicts)
    segment_objects_dicts = list()
    for seg in segment_objects:
        
        segment_dict = dict({
            'id': seg.id,
            'name': seg.name, 
            'beginning': str(seg.beginning), 
            'end': str(seg.end), 
            'audio': seg.audio.id, 
            'creator': {
                'id': seg.creator.id, 
                'username': seg.creator.username, 
            }, 
        })
        
        segment_objects_dicts.append(segment_dict)
    
    data['segment_objects'] = segment_objects_dicts
    
    #   Serialize master object for transport, and send it to client
    data_serialized = simplejson.dumps(data)
    return HttpResponse(data_serialized, content_type='data/json')
    

