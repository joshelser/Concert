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
#   Get the upload progress for a currently uploading file.  If the result from the
#   cache is null, it means the upload has completed.
###
@login_required
def get_upload_progress(request, upload_id):
    data = cache.get(upload_id)
    return HttpResponse(
        simplejson.dumps(data),
        content_type = 'application/json'
    )


##
#   This controller returns a unique upload_id for use in the cache, so the 
#   client side can keep track of upload progress.  It also reserves that spot in 
#   the cache.
###
@login_required
def upload_id(request):
    # Generate a unique upload id so we can track progress of the upload
    upload_id = hashlib.sha224(os.urandom(16)).hexdigest()
    while(cache.get(upload_id) != None) :
        upload_id = hashlib.sha224(os.urandom(16)).hexdigest()
    
    # Save spot in cache
    cache.set(upload_id, {
        'length': 0,
        'uploaded' : 0
    })
    
    response = dict({
        'status': 'success',
        'upload_id': upload_id
    })

    #   Serialize results into JSON response        
    return HttpResponse(
        simplejson.dumps(response),
        content_type = 'application/json'
    )
    

##
# The upload_audio page.  User goes here to upload audio to a specific collection.
#
# @param    request HTTP Request
##
@login_required
def upload_audio(request):
    user = request.user
    
    username = user.username
    
    data = {
        'collections': user.get_profile().get_collections_dict(), 
    }
    
    if request.method == 'POST':
        # The id for this upload (we will use this at the end)
        upload_id = request.POST['upload_id']
        
        # The file being uploaded
        f = request.FILES['audio']
        
        
        # The collection that this audio object is to be associated with.
        try:
            col = Collection.objects.get(id = request.POST['collection'])
        except ObjectDoesNotExist, e:
            return HttpResponse('Error: Invalid collection chosen.', mimetype='text/plain')

        
        
        #   new audio object
        audio = Audio(uploader = user, collection=col)

        
        try:
            #   initialize audio object (this will take a while as we have to encode)
            audio.init(f)
        except IOError, e:
            # Delete audio object that was partially created.
            audio.delete()
            return HttpResponse('An error occured while opening the file.', mimetype='text/plain')
        except audiotools.UnsupportedFile, e:
            # Delete audio object that was partially created.
            audio.delete()
            return HttpResponse('Error: Unsupported file type.', mimetype='text/plain')
        except audiotools.PCMReaderError, e:
            # Delete audio object that was partially created.
            audio.delete()
            return HttpResponse('Error reading file.', mimetype='text/plain')
        except Exception, e:
            audio.delete()
            return HttpResponse('Error: '+str(e), mimetype='text/plain')
            
            
            
        
                        
        return HttpResponse('success', mimetype='text/plain')
        
        

        
    else :        
        return render_to_response('audio/upload_audio.html', {
            'page_name': 'Upload Audio',
            'js_page_path': '/audio/upload/',
            'data': simplejson.dumps(data), 
        }, RequestContext(request));
