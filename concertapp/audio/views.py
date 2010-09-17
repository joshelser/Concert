from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.core.files.uploadedfile import SimpleUploadedFile

from concertapp.models  import *
from concertapp.forms   import UploadFileForm

from concertapp.audio import audioFormats
from concertapp.audio.waveform import *
from concertapp.settings import MEDIA_ROOT, LOGIN_REDIRECT_URL

import os, tempfile

CHUNKSIZE = 1024 * 32

##
# View all of the audio files you have uploaded
#
# @param request    HTTP Request
##
@login_required
def audio(request):
    audio = Audio.objects.filter(user = request.user)

    return render_to_response("audio.html", {'audio': audio},
            RequestContext(request))

##
# Views a single audio file
#
# @param request    HTTP Request
# @param audio_id   The audio object id
##
def view_audio(request, audio_id):
    audio = Audio.objects.get(pk = audio_id)
    return render_to_response("view_audio.html", {'audio': audio}, RequestContext(request))

##
# Takes an audio file, converts it to mp3, ogg, and wav, saving it to disk
# 
# @param request    HTTP Request
##
@login_required
def upload_audio(request):
    if request.method == 'POST' and "wavfile" in request.FILES:
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
            
            if "ajax" in request.POST:
                response = HttpResponse(mimetype='text/plain', responseText = 'success');
                response.write("sucess")
                return response
            else:
                return HttpResponseRedirect('/audio/')
        else:
            if "ajax" in request.POST:
                response = HttpResponse(mimetype='text/plain', responseText = 'failure')
                response.write("failure")
                return response
            else:          
                print repr(form.errors)
    
    form = UploadFileForm()
    if "ajax" in request.POST:
        response = HttpResponse(mimetype='text/plain',responseText = 'failure')
        response.write("failure")
        return response
    else:
        return render_to_response('upload_audio.html', {'form': form})

##
# Display the waveform for an audio object
# 
# @param request     HTTP Request
# @param audio_id    The audio object id
##
def view_waveform(request, audio_id):
    return render_to_response('view_waveform.html', {'audio': a}, RequestContext(request))

###
#   responds in plain text with the audio waveform url for the requested
#   audio object.
#
#   @param          request         HTTP request
#   @param          audio_id        The Audio object id
#   @param          type_waveform   specifies which image is wanted
###
def waveform_src(request, audio_id, type_waveform = 'viewer'):
    audio = Audio.objects.get(pk = audio_id)
    
    # return waveform path in plaintext
    response = HttpResponse(mimetype='text/plain')
    if type_waveform == 'viewer':
        response.write(audio.waveformViewer.url)
    elif type_waveform == 'editor':    
        response.write(audio.waveformEditor.url)
    else:
        raise Exception("paramater type_waveform can be either 'viewer' or 'editor', '" + type_waveform + "' its invalid")
        return
        
    return response
    
###
#   Responds in plain text with the path to the audiofile associated with
#   the requested Audio object.
#
#   @param          request         HTTP request
#   @param          audio_id        The Audio object id
###/    
def audio_src(request, audio_id):
    audio = Audio.objects.get(pk = audio_id)
    
    #return audio src in plaintext
    response = HttpResponse(mimetype='text/plain')
    response.write(audio.wavfile.url)
    return response

##
# Given an audio object, generate all the waveforms for it, and save them to the
# database
#
# @param audio    The audio object to generate waveforms from
def generate_waveform(audio):
    # Create the wav object
    wavObj = audioFormats.Wav(os.path.join(MEDIA_ROOT, str(audio.wavfile)))
    length = wavObj.getLength()
    
    # Name of the image for the waveform viewer (small waveform image) 
    viewerImgPath = 'images/viewers/'+str(audio.wavfile) + '_800.png'    
    wavObj.generateWaveform(os.path.join(MEDIA_ROOT, viewerImgPath), 800, 110)

    # Name of the image for the waveform editor (large waveform image)
    editorImgPath = 'images/editors/'+str(audio.wavfile) + '_' + str(5 * length) + '.png'
    wavObj.generateWaveform(os.path.join(MEDIA_ROOT, editorImgPath), 5 * length, 585)

    # Save the path relative to the media_dir
    audio.waveformViewer = viewerImgPath    
    audio.waveformEditor = editorImgPath

    # Save the audio object
    audio.save()

###
# Returns the duration of the audio file associated with the passed-in audio object.
#
# @param      audio     The audio object.
###
def get_duration(audio):
  # Create wav object
  wavObj = audioFormats.Wav(os.path.join(MEDIA_ROOT, str(audio.wavfile)))
  # Get duration
  return wavObj.getLength()

##
# Delete the audio object and all objects referencing it, including files on
# disk
#
# @param request    HTTP Request
# @param audio_id   The id of the audio object to delete
##
def delete_audio(request, audio_id):
    audio = Audio.objects.get(pk = audio_id)

    # Bounce user if not the owner
    if int(request.user.id) != int(audio.user.id):
        return Http404

    audio.delete()

    return HttpResponseRedirect('/audio/')

##
#   Add the specified segment to the specified group.  This means
#   creating a new segment object for this group, as well as 
#   new tag objects for any of the specified segment's tags
#   unless there is a tag in the new group that is named the same.
#
#   @param      request         HTTP request
#   @param      segment_id      The id of the specified segment
#   @param      group_id        the id of the specified group
###
def add_segment_to_group(request, segment_id, group_id) :

    # Get the specified segment
    old_segment = AudioSegment.objects.get(pk = segment_id)
    
    # First we need to create the new audio segment with the properties of the old one
    new_segment = AudioSegment(name = old_segment.name, beginning = old_segment.beginning, end = old_segment.end, audio = old_segment.audio)
    new_segment.save()
    
    #   Next, we need to add all of the tags from the old segment/group, to the new segment/group, but 
    #   not if a tag with the same name already exists for the new group.
    
    # Get all of the specified segment's tags (except for Uploads)
    old_segment_tags = old_segment.tag_set.all().exclude(tag = 'Uploads')
    
    # Get specified group
    group = Group.objects.get(pk = group_id)
    
    # Get all tags associated with this group (except for uploads tag)
    group_tags = Tag.objects.filter(group = group).exclude(tag = 'Uploads')
    
    # For each of the old segment's tags
    for old_tag in old_segment_tags :
        
        # If the new group has a tag that is named the same
        try :
            other_version_of_tag = group_tags.get(tag = old_tag.tag)
            
            # Add the new segment to this group's version of the tag
            other_version_of_tag.segments.add(new_segment)
            other_version_of_tag.save()
            
        # If the new group does not have a tag matching this name
        except Tag.DoesNotExist:
            # Create the tag within the group
            new_tag = Tag(tag = old_tag.tag, group = group, isProject = 0, isFixture = 0)
            new_tag.save()
            # Add the segment to the newly created tag
            new_tag.segments.add(new_segment)
            new_tag.save()
            
    
    # We will return plaintext response
    response = HttpResponse(mimetype='text/plain')
    # If an error variable was defined in this scope
    if 'error' in locals() :
        response.write(error)
    else :
        response.write('success')
    return response
