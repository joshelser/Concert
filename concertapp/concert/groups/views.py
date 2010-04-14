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

def groups(request, message = None):
    groups = Group.objects.all()

    if request.GET['message']:
        message = request.GET['message']

    return render_to_response('all_groups.html', {'groups': groups, 'message': message},
            RequestContext(request))

@login_required
def join_group(request, group_name):
    return render_to_response('join_group.html', {'group_name': group_name},
            RequestContext(request))

@login_required
def request_to_join_group(request):
    if request.method == 'POST':
        group_name = request.POST['group_name']

        # Make sure a request doesn't already exist for this user and group
        try:
            ug_requests = UserGroupRequest.objects.get(user = request.user,
                    gname = group_name)
        except UserGroupRequest.DoesNotExist:
            pass
        else:
            return HttpResponse(
                    '<h1>Error</h1><p>A request already exists</p>')

        ug_request = UserGroupRequest(user = request.user, gname = group_name)

        ug_request.save()

        url = '/groups/?message=Group request left successfully'

        return HttpResponseRedirect(url)
        #return groups(request, 'Group request left successfully')
    else:
        print "nope"




