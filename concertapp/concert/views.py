from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.views.generic.create_update  import create_object
from django.views.generic.simple import direct_to_template
from django.contrib.auth import authenticate, login, logout

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

def upload_audio(request):
    if request.method == 'POST':
        # Need to add the user to the audio instance
        user = request.user

        # Bounce back to audio if not logged in
        if user is None:
            return HttpResponseRedirect('/audio/')

        audio = Audio(user=user)

        # Try to add handler to generate the waveform after uploading
#        request.upload_handlers.append(generate_waveform)

        # Then add the audio instance to the Form instance
        form = UploadFileForm(request.POST, request.FILES, instance=audio)
        if form.is_valid():
            # Save the form
            form.save()
            generate_waveform(audio)
            return HttpResponseRedirect('/audio/')
        else:
            print repr(form.errors)
    else:
        form = UploadFileForm()

    return render_to_response('upload_audio.html', {'form': form})

def generate_waveform(audio):
    # Create the wav object
    obj = audioFormats.audio(os.path.join(settings.MEDIA_ROOT, str(audio.wavFile)))
    wavObj = audioFormats.wav(obj)
    length = wavObj.getLength()
    print os.path.join(settings.MEDIA_ROOT,'images/'+str(audio.wavFile)+'.png')
    wavObj.generateWaveform(os.path.join(settings.MEDIA_ROOT,
        'images/'+str(audio.wavFile)+'.png'), 5 * length, 585)


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
