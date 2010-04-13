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

def groups(request):
    groups = Group.objects.all()

    return render_to_response('all_groups.html', {'groups': groups},
            RequestContext(request))

@login_required
def join_group(request, group_id):
    return HttpResponse("<html><body>hi</body></html")
