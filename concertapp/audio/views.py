from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.core.cache import cache
from django.utils import simplejson
from django.core.files.uploadedfile import SimpleUploadedFile

import os, hashlib, tempfile, audiotools

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
    
    if request.method == 'POST':
        # The file being uploaded
        f = request.FILES['audio']

        # grab the filename of the temporary uploaded file
        inputFilePath = f.temporary_file_path()
        
#        destination = open(inputFilePath, 'wb+')
#        for chunk in f.chunks():
#            destination.write(chunk)
#        destination.close()

        #   Upload a dummy file (just containing 'a'), just so we can get a 
        #   unique filename.  This will be the actual .wav file soon.  This temporary
        #   file is named "originalfilename.originalextension.wav"
        #fileName = os.path.split(str(f))[-1]
        #wavFile = SimpleUploadedFile(fileName+'.wav', 'a')
        
        #   Audio object with dummy wav file in it
        #audio = Audio(user = user, wavfile = wavFile, filename = fileName)
        
        #form = UploadFileForm(request.POST, instance = audio)
        #if form.is_valid():
            #   Save the form, copies the dummy file to the proper location
            #audio = form.save()
        
            #   Now we can get the new dummy file location with the
            #   auto-generated name
            #outputFilePath = os.path.join(MEDIA_ROOT, str(audio.wavfile))
            #try:
                # Create the normalized .wav file at the location specified
                # above.  This will overwrite the dummy file we created.
                # Also we must handle errors here.
                #audioHelpers.toNormalizedWav(inputFilePath, outputFilePath)
                
                #Create ogg and mp3 versions of the audio (and handle errors)
                #audio.create_ogg_and_mp3()
                
            #except (
            #    audiotools.UnsupportedFile, 
            #    IOError, 
            #    audiotools.PCMReaderError,
            #    Exception
            #), e:
                # Right now we have no better way to handle errors
                #errorText = 'Error: '+str(e)
                #response = HttpResponse(mimetype='text/plain')
                #response.write(errorText)
                #audio.delete()
                #return response
            
            # Generate the waveform onto disk
            #audio.generate_waveform()

            #audio.save()
            
            # Get audio duration in seconds
            #duration = get_duration(audio)

            # Get user's default group
            #default_group = user.groups.get(name = user.username)

            # Determine name of segment and tag
            #name = audio.filename

            # Create the initial audio segment
            #first_segment = AudioSegment(name = name, beginning = 0, end = duration, audio = audio)
            #first_segment.save()

            # Tag segment with default tag
            #default_tag = Tag.objects.get(group = default_group, tag = 'Uploads')
            #default_tag.segments.add(first_segment)
            #default_tag.save()
            
            
        return HttpResponse('success', content_type = 'text/plain')

        
    else :        
        return render_to_response('audio/upload_audio.html', {
            'page_name': 'Upload Audio'
        }, RequestContext(request));
