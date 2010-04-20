from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.views.generic.create_update  import create_object
from django.views.generic.simple import direct_to_template
from django.contrib.auth import authenticate, login, logout
from django import forms

from django.core.files.uploadedfile import SimpleUploadedFile

from concertapp.models  import *
from concertapp.forms   import RegistrationForm, UploadFileForm

from concertapp.audio import audioFormats
from concertapp.audio.waveform import *
from concertapp.settings import MEDIA_ROOT, LOGIN_REDIRECT_URL

import os, tempfile

CHUNKSIZE = 1024 * 32

def audio(request):
    audio = Audio.objects.all()

    return render_to_response("audio.html", {'audio': audio},
            RequestContext(request))

def view_audio(request, audio_id):
    audio = Audio.objects.get(pk = audio_id)
    return render_to_response("view_audio.html", {'audio': audio}, RequestContext(request))

@login_required
def upload_audio(request):
    if request.method == 'POST':
        # Need to add the user to the audio instance
        user = request.user

        audio = Audio(user = user)

        file = request.FILES['wavfile']

        audio.filename = str(file)
        filetype = file.content_type

        form = None
        wavFileName = None
        extension = None
        oggFileName = None

        # If it's already a wav file
        if filetype == 'audio/x-wav':
            oggFileName = audio.wav_to_ogg(request.FILES['wavfile'])
            oggFile = SimpleUploadedFile(os.path.split(oggFileName)[-1], 'a')
            
            # Add the audio stuff to the audio object
            audio.oggfile = oggFile
            audio.wavfile = request.FILES['wavfile']
        else:
            # We need to convert the file
            if filetype == 'audio/mpeg':
                # Convert mp3 to wav
                wavFileName = audio.mp3_to_wav(request.FILES['wavfile'])

                # Convert mp3 to ogg
                oggFileName = audio.wavfilename_to_ogg(wavFileName)

                audio.oggfile = SimpleUploadedFile(os.path.split(oggFileName)[-1], 'a')
            elif filetype == 'audio/ogg' or filetype == 'application/ogg':
                wavFileName = audio.ogg_to_wav(request.FILES['wavfile'])

                # Save the oggfile in audio
                audio.oggfile = request.FILES['wavfile']

                # Get the full path to the temp file
                oggFileName = request.FILES['wavfile'].temporary_file_path()
            else:
                # Fallback onto file extensions
                extension = os.path.splitext(str(request.FILES['wavfile']))[1]

                if extension == '.wav':
                    oggFileName = audio.wav_to_ogg(request.FILES['wavfile'])
                    oggFile = SimpleUploadedFile(os.path.split(oggFileName)[-1], 'a')
            
                    # Add the audio stuff to the audio object
                    audio.oggfile = oggFile
                    audio.wavfile = request.FILES['wavfile']
                elif extension == '.mp3':
                    wavFileName = audio.mp3_to_wav(request.FILES['wavfile'])

                    # Convert mp3 to ogg
                    oggFileName = audio.wavfilename_to_ogg(wavFileName)

                    audio.oggfile = SimpleUploadedFile(os.path.split(oggFileName)[-1], 'a')
                elif extension == '.ogg':
                    wavFileName = audio.ogg_to_wav(request.FILES['wavfile'])

                    # Save the oggfile in audio
                    audio.oggfile = request.FILES['wavfile']

                    # Get the full path to the temp file
                    oggFileName = request.FILES['wavfile'].temporary_file_path()
                else:
                    msg = 'The submitted filetype "%s" has no waveform functionality implemented'
                    raise NotImplementedError(msg % filetype)

            # Ignore this if we got a .wav extension
            if extension != '.wav':
                # Put it in the audio object
                audio.wavfile = SimpleUploadedFile(os.path.split(wavFileName)[-1], 'a')

        # Then add the audio instance to the Form instance
        form = UploadFileForm(request.POST, instance = audio)

        if form.is_valid():
            # Save the form
            audio = form.save()

            # Copy over the file if it wasn't initially a wav
            if filetype != 'audio/x-wav' and extension != '.wav':
                # Open up the file in temp and in media
                actual_file = open(wavFileName, 'r')
                dest_file = open(os.path.join(MEDIA_ROOT, str(audio.wavfile)), 'w')

                # Buffered read into the file in the media dir
                data = actual_file.read(CHUNKSIZE)
                while data != '':
                    dest_file.write(data)
                    data = actual_file.read(CHUNKSIZE)

                # Close the file handles
                actual_file.close()
                dest_file.close()

                # Remove the file from /tmp
                os.remove(wavFileName)

            # Need to copy over the temp ogg file to MEDIA_ROOT regardless of
            # uploaded file type
            tempOggFile = open(oggFileName, 'r')
            destOggFile = open(os.path.join(MEDIA_ROOT, str(audio.oggfile)),
                    'w')

            data = tempOggFile.read(CHUNKSIZE)
            while data != '':
                destOggFile.write(data)
                data = tempOggFile.read(CHUNKSIZE)

            tempOggFile.close()
            destOggFile.close()

            # Generate the waveform onto disk
            generate_waveform(audio)
            
            # Get audio duration in seconds
            duration = get_duration(audio)
            
            # Get user's default group
            default_group = user.groups.get(name = user.username)
            
            # Determine name of segment and tag
            name = audio.filename
            
            # Create the initial audio segment
            first_segment = AudioSegment(name = name, beginning = 0, end = duration, audio = audio)
            first_segment.save()
            
            # Tag segment with default tag
            default_tag = Tag.objects.get(group = default_group, tag = 'Uploads')
            default_tag.segments.add(first_segment)
            default_tag.save()
            

            return HttpResponseRedirect('/audio/')
        else:
            print repr(form.errors)
    else:
        form = UploadFileForm()

    return render_to_response('upload_audio.html', {'form': form})

def view_waveform(request, audio_id):
    return render_to_response('view_waveform.html', {'audio': a}, RequestContext(request))
    
def waveform_src(request, audio_id):
    audio = Audio.objects.get(pk = audio_id)
    
    # return waveform path in plaintext
    response = HttpResponse(mimetype='text/plain')
    response.write(audio.waveform.url)
    return response
    
    
def audio_src(request, audio_id):
    audio = Audio.objects.get(pk = audio_id)
    
    #return audio src in plaintext
    response = HttpResponse(mimetype='text/plain')
    response.write(audio.oggfile.url)
    return response

def generate_waveform(audio):
    # Create the wav object
    wavObj = audioFormats.Wav(os.path.join(MEDIA_ROOT, str(audio.wavfile)))
    length = wavObj.getLength()

    # Name of the image file
    imgPath = 'images/'+str(audio.wavfile) + '_' + str(5 * length) + '.png'

    wavObj.generateWaveform(os.path.join(MEDIA_ROOT, imgPath), 5 * length, 585)

    # Save the path relative to the media_dir
    audio.waveform = imgPath
    audio.save()

###
# get_duration
# Returns the duration of the audio file associated with the passed-in audio object.
#
# @param      audio     The audio object.
###
def get_duration(audio):
  # Create wav object
  wavObj = audioFormats.Wav(os.path.join(MEDIA_ROOT, str(audio.wavfile)))
  # Get duration
  return wavObj.getLength()

def delete_audio(request, audio_id):
    audio = Audio.objects.get(pk = audio_id)
    if audio.delete_wavfile():
        audio = Audio.objects.all()
        return render_to_response("audio.html", {'audio': audio}, RequestContext(request))
    else:
        return render_to_response("view_audio.html", {'audio': audio}, RequestContext(request))


