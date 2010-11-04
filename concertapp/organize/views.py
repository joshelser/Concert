from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.core.cache import cache
from django.utils import simplejson
from django.core.files.uploadedfile import SimpleUploadedFile

from django.core.exceptions import ObjectDoesNotExist

import os, hashlib, tempfile, audiotools, tempfile

from concertapp.models  import *

from concertapp.audio import audioFormats, audioHelpers
from concertapp.audio.waveform import *
from concertapp.settings import MEDIA_ROOT, LOGIN_REDIRECT_URL


###
#   The main organize page for a collection.  This is where we do it all.
###
@login_required
def organize_collection(request, collection_id):
    
    user = request.user
    
    # Get specified collection
    try:
        col = Collection.objects.get(id = collection_id)
        
        # Make sure user is a member 
        col.users.get(id = user.id)
        
    except ObjectDoesNotExist, e:
        return HttpResponse('Error: Invalid collection.')
        
    
    
    files = Audio.objects.filter(collection = col)
    segments = AudioSegment.objects.filter(collection = col)
    
    
    return render_to_response('organize/organize_collection.html', {
        'page_name': 'Organize '+col.name,
        'js_page_path': '/organize/collection/',
        'files': files,
        'segments': segments
    }, RequestContext(request));