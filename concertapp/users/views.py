from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.views.generic.create_update  import create_object
from django.views.generic.simple import direct_to_template
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import Group, User
from django import forms

from concertapp.models  import *
from concertapp.forms   import RegistrationForm, CreateGroupForm
from django.contrib.auth.forms import PasswordChangeForm

from concertapp.settings import MEDIA_ROOT, LOGIN_REDIRECT_URL

    
def users(request):
    users = User.objects.all()

    return render_to_response("users.html", {'users': users},
            RequestContext(request))

def view_user(request, user_id):
    user = User.objects.get(pk = user_id)

    return render_to_response('view_user.html', {'user': user},
            RequestContext(request))

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
            # Create new user
            new_profile = User.objects.create_user(username=new_name, email=new_email, password=new_password1)
            new_profile.save()
            
            # Create user's default group with same name as user
            new_group = Group(name = new_name)
            new_group.save();
            
            # Add this user as an administrator of the group
            new_group_admin = GroupAdmin(group = new_group, admin = new_profile)
            new_group_admin.save()
            
            # Add this user as a member of the new_group
            new_profile.groups.add(new_group)
            
            # Create the default tag for all audio files uploaded by this user
            default_tag = Tag()

            return HttpResponseRedirect('/users/')
    else:
        form = RegistrationForm()
    return render_to_response('register.html', {'form': form})

def login_user(request):
    error = ''
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        redirect_url = request.POST['next']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)

                # Redirect to the requested page
                return HttpResponseRedirect(redirect_url)
            else:
                return HttpResponse('<h1>Not Active</h1>')
        else:
            error = "Either the username doesn't exist, or the password you gave us isn't correct.  Give it another try.";

    # Use the default post login redirect
    url = LOGIN_REDIRECT_URL

    # Check to see if a post login page was requested
    if request.GET.__contains__('next'):
        url = request.GET['next']
        
    # Render the login page with the appropriate page
    return render_to_response('login.html', {'next': url, 'error': error})

def logout_user(request):
    logout(request)
    return HttpResponseRedirect('/users/login/')

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


@login_required
def groups(request, user_id):
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

@login_required
def create_group(request, user_id):
    if request.method == 'POST':
        form = CreateGroupForm(request.POST)
        if form.is_valid():
            gname = form.cleaned_data['group_name']

            g = Group(name = gname)
            g.save()

            new_group = GroupAdmin(group = g, admin = request.user)
            new_group.save()

            request.user.groups.add(g)

            return groups(request, user_id)
            #render_to_response('groups.html', {'user_id': user_id}, RequestContext(request))
    else:
        form = CreateGroupForm()

    return render_to_response('create_group.html', {'form': form,
        'user_id': user_id})

@login_required
def choose_group(request, user_id):
    groups = GroupAdmin.objects.filter(admin = request.user)
    return render_to_response('choose_group.html', {'groups': groups, 'user_id':
        user_id, 'length': len(groups)}, RequestContext(request))

@login_required
def accept_request(request, user_id, group_id, new_user_id):
    return render_to_response('accept_request.html', {'user_id':user_id,
        'group_id': group_id, 'new_user_id': new_user_id}, RequestContext(request))

@login_required
def manage_group(request, user_id, group_id):
    group = GroupAdmin.objects.get(group = Group.objects.get(pk = group_id))

    # Check to see if the user is also the admin
    if int(user_id) != int(group.admin_id):
        return HttpResponse("<html><body><h3>Insufficient\
        permission</h3></body></html>")

    return render_to_response('manage_group.html', {'group_id': group_id,
        'user_id':user_id}, RequestContext(request))

@login_required
def remove_user(request, user_id, group_name):
    users = User.objects.filter(groups__name=group_name).exclude(id = user_id)
    return render_to_response('remove_user.html', {'group':group_name,
        'user_id':user_id, 'users': users}, RequestContext(request))

@login_required
def remove(request, user_id, group_name, user):
    return render_to_response('delete_user.html', {'user_id':user_id,
        'group': group_name, 'user': user}, RequestContext(request))

def remove_from_group(request,user_id, group_name, user):
    User.objects.get(username = user).groups.remove(Group.objects.get(name = group_name))
    url = '/users/'+user_id+'/groups/manage/'+group_name+'/remove_user/'
    return HttpResponseRedirect(url)

@login_required
def pending_requests(request, user_id, group_id):
    group_admin = GroupAdmin.objects.get(group = Group.objects.get(pk = group_id))

    # Check to see if the user is also the admin
    if int(user_id) != int(group_admin.admin.id):
        return HttpResponse("<html><body><h3>Insufficient\
        permission</h3></body></html>")

    requests = UserGroupRequest.objects.filter(group = group_admin.group)
    return render_to_response('pending_requests.html', {'group_id':group_id,
        'user_id':user_id, 'requests': requests}, RequestContext(request))

def add_to_group(request, user_id, group_id, new_user_id):
    if request.method == 'POST':
        #group_id = request.POST['group_id']
        #user_id = request.POST['user_id']

        UserGroupRequest.objects.get(group = Group.objects.get(pk = group_id),
                user = User.objects.get(pk = new_user_id)).delete()

        user = User.objects.get(pk = new_user_id)
        g = Group.objects.get(pk = group_id)

        user.groups.add(g)

        url = '/users/'+user_id+'/groups/manage/'+group_id+'/pending_requests/'
        return HttpResponseRedirect(url)

    



