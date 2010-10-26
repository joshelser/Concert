#from concertapp.forms   import RegistrationForm, CreateGroupForm
from concertapp.models  import *
from concertapp.settings import MEDIA_ROOT, LOGIN_REDIRECT_URL
from django import forms
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.models import Group, User
from django.http import Http404
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext

##
#   Creates a user in the system
#
#   @param    request    HTTP request
##
def create_user(request):
    # if request.user.is_authenticated():
    # They already have an account; don't let them register again
    #    return render_to_response('create_user.html', {'has_account': True})
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            new_name = form.cleaned_data['username']
            new_email = form.cleaned_data['email']
            new_password1 = form.cleaned_data['password1']
            new_password2 = form.cleaned_data['password2']
            
            try:
                Group.objects.get(name = new_name)
            except Group.DoesNotExist:
                pass
            else:
                return HttpResponse(
                    '<h1>Error</h1><p>This username is already taken.</p>')

            # Create new user
            new_profile = User.objects.create_user(username=new_name, email=new_email, password=new_password1)
            new_profile.save()

            # Create user's default group
            new_group = create_group_all(new_profile, tag_is_fixture = 1)
            
            return HttpResponseRedirect('/')
    else:
        form = RegistrationForm()
    return render_to_response('register.html', {'form': form})
##
#    Changes the current user's password
#
#    @param    request    HTTP request
##
@login_required
def change_password(request):
    if request.method == 'POST':
        f = PasswordChangeForm(request.user, request.POST)

        if f.is_valid():
            # Get the user
            user = User.objects.get(pk = request.user.id)

            # Set the new password
            user.set_password(f.cleaned_data['new_password1'])

            # Save the user
            user.save()

            return HttpResponseRedirect('/')
        else:
            print repr(f.errors)
    else:
        f = PasswordChangeForm(request.user)
    
    return render_to_response('change_password.html', {'form': f},
            RequestContext(request))

##
#    Gets all of the groups of the user
#
#    @param    request    HTTP request
#    @param    user_id    The id of the current user
##
@login_required
def groups(request, user_id):
    if request.user.id != int(user_id):
        raise Http404

    user = User.objects.get(pk = user_id)
    groups = list()
    for group in user.groups.all():
        groups.append(group.name)

    # Only show the add group link if it's your page
    # Need to cast the user_id to an int
    if request.user.id == int(user_id):
        show_create = True
    else:
        show_create = None

    return render_to_response("groups.html", {'groups': groups, 'length':
        len(groups), 'user_id': user_id, 'show_create': show_create},
        RequestContext(request))



##
#    Choose a group to manage
#
#    @param    request    HTTP request
#    @param    user_id    The id of the user
##
@login_required
def choose_group(request, user_id):
    if request.user.id != int(user_id):
        raise Http404

    groups = GroupAdmin.objects.filter(admin = request.user)
    return render_to_response('choose_group.html', {'groups': groups, 'user_id':
        user_id, 'length': len(groups)}, RequestContext(request))

##
#    Accepts another user's request to join a group
#
#    @param    request      HTTP request
#    @param    user_id      The id of the user
#    @param    group_id     The id of the group
#    @param    new_user_id  The id of the user joining the group
##
@login_required
def accept_request(request, user_id, group_id, new_user_id):
    if request.user.id != int(user_id):
        raise Http404

    return render_to_response('accept_request.html', {'user_id':user_id,
        'group_id': group_id, 'new_user_id': new_user_id}, RequestContext(request))

##
#    Manage the selected group
#
#    @param    request    HTTP request
#    @param    user_id    The id of the user
#    @param    group_id   The id of the group
##
@login_required
def manage_group(request, user_id, group_id):
    if request.user.id != int(user_id):
        raise Http404

    group = GroupAdmin.objects.get(group = Group.objects.get(pk = group_id))

    # Check to see if the user is also the admin
    if int(user_id) != int(group.admin_id):
        return HttpResponse("<html><body><h3>Insufficient\
        permission</h3></body></html>")

    return render_to_response('manage_group.html', {'group_id': group_id,
        'user_id':user_id}, RequestContext(request))

##
#    Choose a user to remove from the group
#
#    @param    request    HTTP request
#    @param    user_id    The id of the logged in user
#    @param    group_id   The id of the group being managed
##
@login_required
def remove_user(request, user_id, group_id):
    if request.user.id != int(user_id):
        raise Http404

    users = User.objects.filter(groups__id=group_id).exclude(id = user_id)
    return render_to_response('remove_user.html', {'group':group_id,
        'user_id':user_id, 'users': users}, RequestContext(request))

##
#    Verification page to remove a user from a group
#
#    @param    request    HTTP request
#    @param    user_id    The id of the logged in user
#    @param    group_name The name of the group
#    @param    g_user_id  The user to remove from the group
##
@login_required
def remove(request, user_id, group_name, g_user_id):
    if request.user.id != int(user_id):
        raise Http404

    return render_to_response('delete_user.html', {'user_id':user_id,
        'group': group_name, 'g_user_id': g_user_id}, RequestContext(request))

##
#    Remove the user from the desired group
#
#    @param    request    HTTP request
#    @param    user_id    The id of the logged in user
#    @param    group_id   The id of the group
#    @param    g_user_id  The user to remove from the group
##
def remove_from_group(request,user_id, group_id, g_user_id):
    if request.user.id != int(user_id):
        raise Http404

    # Get the user's groups and remove the group with the id equal to group_id
    User.objects.get(pk = g_user_id).groups.remove(Group.objects.get(pk =
        group_id))

    # Redirect URL
    url = '/users/'+user_id+'/groups/manage/'+group_id+'/remove_user/'

    return HttpResponseRedirect(url)

##
#    Confirmation page to delete a group
#
#    @param    request    HTTP request
#    @param    user_id    The id of the current user
#    @param    group_id   The id of the group to delete
##
def delete_confirm(request,user_id, group_id):
    if request.user.id != int(user_id):
        raise Http404

    return render_to_response('delete_confirm.html', {'user_id':user_id,
        'group_id':group_id}, RequestContext(request))

##
#    Delete the actual group
#
#    @param    request    HTTP request
#    @param    user_id    The id of the current user
#    @param    group_id   The id of the group to delete
##
def delete(request,user_id, group_id):
    if request.user.id != int(user_id):
        raise Http404

    group = Group.objects.get(pk = group_id)
    group.delete()
    url = '/users/'+user_id+'/groups/manage/'
    return HttpResponseRedirect(url)
    
##
#    List out all of the pending requests to join a group
#
#    @param    request    HTTP request
#    @param    user_id    The id of the current user
#    @param    group_id   The id of the group
##
@login_required
def pending_requests(request, user_id, group_id):
    if request.user.id != int(user_id):
        raise Http404

    group_admin = GroupAdmin.objects.get(group = Group.objects.get(pk = group_id))

    # Check to see if the user is also the admin
    if int(user_id) != int(group_admin.admin.id):
        return HttpResponse("<html><body><h3>Insufficient\
        permission</h3></body></html>")

    requests = UserGroupRequest.objects.filter(group = group_admin.group)
    return render_to_response('pending_requests.html', {'group_id':group_id,
        'user_id':user_id, 'requests': requests}, RequestContext(request))
    
##
#    Add a user to the group
#
#    @param    request     HTTP request
#    @param    user_id     The id of the current user
#    @param    group_id    The id of the current group
#    @param    new_user_id The id of the user to add to the group
##
def add_to_group(request, user_id, group_id, new_user_id):
    if request.user.id != int(user_id):
        raise Http404

    if request.method == 'POST':
        UserGroupRequest.objects.get(group = Group.objects.get(pk = group_id),
                user = User.objects.get(pk = new_user_id)).delete()

        user = User.objects.get(pk = new_user_id)
        g = Group.objects.get(pk = group_id)

        user.groups.add(g)

        url = '/users/'+user_id+'/groups/manage/'+group_id+'/pending_requests/'
        return HttpResponseRedirect(url)

##
#   Return the groups associated with a given user, excluding that user's
#   default group.  This will be used to generate a select box so the 
#   user can add a segment to a group.
#
#   @param      request     HTTP request
##
def user_group_select(request) :
    # Get all of this user's groups except for the default group
    groups = request.user.groups.all().exclude(name = request.user.username)

    return render_to_response('user_group_select.html', {
    # The list of group objects
    'groups' : groups
        
    }, RequestContext(request))
