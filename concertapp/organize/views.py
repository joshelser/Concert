from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.core.cache import cache
from django.utils import simplejson
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core import serializers
from django.core.exceptions import ObjectDoesNotExist

import os, hashlib, tempfile, audiotools, tempfile

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
#   This controller produces a list of audio files for the audio list panel
###
@login_required
@user_is_member_and_collection_exists
def audio_files(request, collection_id, col, user):
    
    fileObjects = Audio.objects.filter(collection = col)
    
    data = serializers.serialize('json', Audio.objects.filter(collection = col))
    
    return HttpResponse(data, content_type='data/json')
    
    """
    filesForJSON = list()
    
    for f in fileObjects:
        
        # The uploader for this file
        uploader = dict({
            'name': f.uploader.username,
            'id': f.uploader.id            
        })
        
        #
        
        
        #Build json result
        filesForJSON.append(dict({
            'id': f.id,
            'name': f.name,
            'uploader': uploader,
            'segments': 
        }));
    """
    
    