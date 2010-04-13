from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.views.generic.create_update  import create_object
from django.views.generic.simple import direct_to_template
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import Group
from django import forms

from django.conf import settings

from concertapp.concert.models  import *
from concertapp.concert.forms   import BlogpostForm, RegistrationForm, UploadFileForm, CreateGroupForm


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
def groups(request):
    groups = list()
    for group in request.user.groups.all():
        groups.append(group.name)
    return render_to_response("groups.html", {'groups': groups, 'length': len(groups)},RequestContext(request))

@login_required
def create_group(request):
    if request.method == 'POST':
        form = CreateGroupForm(request.POST)
        if form.is_valid():
                gname = form.cleaned_data['gname']
                new_group = UserGroup(gname = gname, admin = request.user)
                new_group.save()
                g = Group(name = gname)
                g.save()
                request.user.groups.add(g)
                return HttpResponseRedirect('/groups/')
    else:
        form = CreateGroupForm()
    return render_to_response('create_group.html', {'form': form})
    
@login_required
def create_ajaxy_post(request):
    form = BlogpostForm()
    return direct_to_template(request,
                              template='edit_ajaxy_post.html',
                              extra_context={'form':form} )

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
