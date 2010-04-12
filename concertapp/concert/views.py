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
#from django.core.validators import *

from concertapp.concert.models  import *
from concertapp.concert.forms   import BlogpostForm, RegistrationForm, UploadFileForm

from concertapp.concert import audioFormats
from concertapp.concert.waveform import *
from concertapp.settings import MEDIA_ROOT

import os, tempfile

CHUNKSIZE = 1024 * 32

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
    #if request.user.is_authenticated():
        # They already have an account; don't let them register again
    #    return render_to_response('create_user.html', {'has_account': True})
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
                new_name = form.cleaned_data['username']
                new_email = form.cleaned_data['email']
                new_password1 = form.cleaned_data['password1']
                new_password2 = form.cleaned_data['password2']
                new_profile = User.objects.create_user(username=new_name, email=new_email, password=new_password1)
                new_profile.save()
                return HttpResponseRedirect('/users/')
    else:
        form = RegistrationForm()
    return render_to_response('create_user.html', {'form': form})

def login_user(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                return HttpResponse('<h1>Logged in</h1>')#return render_to_response('login.html', {'form': form})
            else:
                return HttpResponse('<h1>Not Active</h1>')#return render_to_response('login.html', {'form': form})
        else:
            return HttpResponse('<h1>No user</h1>')#return render_to_response('login.html', {'form': form})
    return render_to_response('login.html')

def logout_user(request):
    logout(request)
    return HttpResponse('<h1>You were successfully logged out</h1>')

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
            elif filetype == 'audio/ogg' or filetype == 'application/ogg':
                wavFileName = audio.ogg_to_wav(request.FILES['wavfile'])
            else:
                msg = 'The submitted filetype "%s" has no waveform functionality implemented'
                raise NotImplementedError(msg % filetype)

            # Create an (almost) empty file
            wavFile = SimpleUploadedFile(os.path.split(wavFileName)[-1], 'a')
                    
            # Create the form object with the converted file and audio instance
            form = UploadFileForm(request.POST, {'wavfile': wavFile}, instance = audio)

        if form.is_valid():
            # Save the form
            form.save()

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
