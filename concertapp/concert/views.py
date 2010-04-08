from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.views.generic.create_update  import create_object
from django.views.generic.simple import direct_to_template
from django.contrib.auth import authenticate, login, logout
from django import forms

from django.conf import settings

from concertapp.concert.models  import *
from concertapp.concert.forms   import BlogpostForm, RegistrationForm, UploadFileForm

from concertapp.concert import audioFormats
from concertapp.concert.waveform import *

import os

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

        audio = Audio(user=user)

        # Then add the audio instance to the Form instance
        form = UploadFileForm(request.POST, request.FILES, instance=audio)

        file = request.FILES['wavfile']

        audio.filename = str(file)

        if form.is_valid():
            # Save the form
            form.save()

            filetype = file.content_type

            # Generate the waveform onto disk
            generate_waveform(audio, filetype)

            return HttpResponseRedirect('/audio/')
        else:
            print repr(form.errors)
    else:
        form = UploadFileForm()

    return render_to_response('upload_audio.html', {'form': form})

def view_waveform(request, audio_id):
    return render_to_response('view_waveform.html', {'audio': a}, RequestContext(request))

def generate_waveform(audio, filetype):
    # Create the wav object
    obj = audioFormats.audio(os.path.join(settings.MEDIA_ROOT, str(audio.wavfile)))

    if filetype == 'audio/x-wav':
        wavObj = audioFormats.wav(obj)
        length = wavObj.getLength()
        wavObj.generateWaveform(os.path.join(settings.MEDIA_ROOT,
            'images/'+str(audio.wavfile)+'.png'), 5 * length, 585)
    elif filetype == 'audio/mpeg':
        pass
    elif filetype == 'application/ogg':
        pass
    else:
        msg = 'The submitted filetype "%s" has no waveform functionality implemented'
        raise NotImplementedError(msg % filetype)

    # Save the path relative to the media_dir
    audio.waveform = os.path.join('images', str(audio.wavfile)+'.png')
    audio.save()


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
