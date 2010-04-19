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

from concertapp.models import *

@login_required
def index(request):
    # Get all groups for which the current user is a member
    group_list = request.user.groups.all()
    
    # Get selected group, or just user's default group
    try:
      # Use group if one was specified
      selected_group_id = request.GET['selected_group_id']
      selected_group = request.user.groups.get(id = selected_group_id)
    except KeyError:
      # Use user's default group
      selected_group = request.user.groups.get(name = request.user.username)

    return render_to_response('index.html', {'group_list': group_list, 'selected_group': selected_group}, RequestContext(request))
