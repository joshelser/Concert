from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.views.generic.create_update  import create_object
from django.views.generic.simple import direct_to_template
from django.contrib.auth import authenticate, login, logout
from django import forms

from django.conf import settings
from django.core.files.base import File
from django.core.files.uploadedfile import UploadedFile
from django.core.files.uploadedfile import SimpleUploadedFile

from concertapp.concert.models  import *
from concertapp.concert.forms   import BlogpostForm, RegistrationForm, UploadFileForm

from concertapp.concert import audioFormats
from concertapp.concert.waveform import *

import os, tempfile

def posts(request):
    posts = Blogpost.objects.all()

    return render_to_response("posts.html", {
        'posts': posts },
        RequestContext(request))
    
def create_post(request):
    return create_object(request,template_name='edit_post.html',
                         post_save_redirect='/',
                         form_class=BlogpostForm)
    
@login_required
def create_ajaxy_post(request):
    form = BlogpostForm()
    return direct_to_template(request,
                              template='edit_ajaxy_post.html',
                              extra_context={'form':form} )
    
def users(request):
    users = User.objects.all()

    return render_to_response("users.html", {'users': users},
            RequestContext(request))

def create_user(request):
    return create_object(request, 
            template_name='create_user.html',
            post_save_redirect='/users/',
            form_class=RegistrationForm)

def audio(request):
    audio = Audio.objects.all()

    return render_to_response("audio.html", {'audio': audio},
            RequestContext(request))

def view_audio(request, audio_id):
    audio = Audio.objects.get(pk = audio_id)
    return render_to_response("view_audio.html", {'audio': audio}, RequestContext(request))

def upload_audio(request):
    if request.method == 'POST':
        # Need to add the user to the audio instance
        user = request.user

        # Bounce back to audio if not logged in
        if user is None:
            return HttpResponseRedirect('/audio/')

        audio = Audio(user = user)

        file = request.FILES['wavfile']

        audio.filename = str(file)
        filetype = file.content_type

        form = None

        # If it's already a wav file
        if filetype == 'audio/x-wav':
            # Then add the audio instance to the Form instance
            form = UploadFileForm(request.POST, request.FILES, instance = audio)
        else:
            print repr(request.FILES['wavfile'])
            # We need to convert the file
            if filetype == 'audio/mpeg':
                wavFileName = audio.mp3_to_wav(request.FILES['wavfile'])
            elif filetype == 'audio/ogg':
                wavFileName = audio.ogg_to_wav(request.FILES['wavfile'])
            else:
                msg = 'The submitted filetype "%s" has no waveform functionality implemented'
                raise NotImplementedError(msg % filetype)

            # This should be replaced so we don't have to read the entire file into memory 
            actual_file = open(wavFileName, 'r')
            data = actual_file.read()

            wavFile = SimpleUploadedFile(os.path.split(wavFileName)[-1], data)
                    
            audio.wavfile = wavFile

            # Create the form object with the converted file and audio instance
            form = UploadFileForm(request.POST, {'wavfile': wavFile}, instance = audio)

        if form.is_valid():
            # Save the form
            form.save()

            # Generate the waveform onto disk
            generate_waveform(audio)

            return HttpResponseRedirect('/audio/')
        else:
            print repr(form.errors)
    else:
        form = UploadFileForm()

    return render_to_response('upload_audio.html', {'form': form})

def view_waveform(request, audio_id):
    return render_to_response('view_waveform.html', {'audio': a}, RequestContext(request))

def generate_waveform(audio):
    # Create the wav object
    wavObj = audioFormats.Wav(os.path.join(settings.MEDIA_ROOT, str(audio.wavfile)))
    length = wavObj.getLength()
    wavObj.generateWaveform(os.path.join(settings.MEDIA_ROOT,
        'images/'+str(audio.wavfile)+'.png'), 5 * length, 585)

    # Save the path relative to the media_dir
    audio.waveform = os.path.join('images', str(audio.wavfile)+'.png')
    audio.save()

def delete_audio(request, audio_id):
    audio = Audio.objects.get(pk = audio_id)
    if audio.delete_wavfile():
        audio = Audio.objects.all()
        return render_to_response("audio.html", {'audio': audio}, RequestContext(request))
    else:
        return render_to_response("view_audio.html", {'audio': audio}, RequestContext(request))

def dumb_registration(request):
    user = User.objects.create_user('josh', 'josh@josh.com', 'josh')
    user.is_staff = True
    user.save()
    return HttpResponseRedirect('/audio/')

def dumb_login(request):
    user = authenticate(username='josh', password='josh')
    if user is not None:
        if user.is_active:
            login(request, user)
            return HttpResponseRedirect('/audio/')
        else:
            return HttpResponseRedirect('/login')
    else:
        return HttpResponseRedirect('/login')

def dumb_logout(request):
    logout(request)
    return HttpResponseRedirect('/audio/')
