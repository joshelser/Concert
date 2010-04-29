from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.models import Group

from django.conf import settings

from concertapp.models  import *

@login_required
def groups(request, message = None):
    g = Group.objects.all()
    groups = list()
    inGroup = False
    for group in g:
        try:
            request.user.groups.get(name = group.name)
        except Group.DoesNotExist:
            groups.append(group)
        
    if request.GET.__contains__('message'):
        message = request.GET['message']

    return render_to_response('all_groups.html', {
      'groups': groups,
      'message': message},
      RequestContext(request))

@login_required
def join_group(request, group_id):
    group = Group.objects.get(pk = group_id)
    return render_to_response('join_group.html', {'group': group},
            RequestContext(request))

@login_required
def request_to_join_group(request):
    if request.method == 'POST':
        group_id = request.POST['group_id']

        # Get the group object
        group = Group.objects.get(pk = group_id)

        # Make sure a request doesn't already exist for this user and group
        try:
            ug_requests = UserGroupRequest.objects.get(user = request.user,
                    group = group)
        except UserGroupRequest.DoesNotExist:
            pass
        else:
            return HttpResponse(
                    '<h1>Error</h1><p>A request already exists</p>')

        my_groups = request.user.groups.all()

        if group in my_groups:
            return HttpResponse(
                    '<h1>Error</h1><p>You are already a member</p>')

        ug_request = UserGroupRequest(user = request.user, group = group)

        ug_request.save()

        url = '/admin/' + str(request.user.id) + '/?message=Group request sent successfully'

        return HttpResponseRedirect(url)
    else:
        print "nope"


