from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response, get_object_or_404
from django.template.loader import render_to_string
from django.template import RequestContext
from django.views.generic.create_update  import create_object
from django.views.generic.simple import direct_to_template
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import Group, User
from django import forms
from django.forms.util import ValidationError
from django.core.urlresolvers import reverse

from concertapp.models  import *
#from concertapp.forms   import RegistrationForm, CreateGroupForm
#from django.contrib.auth.forms import PasswordChangeForm

from concertapp.settings import MEDIA_ROOT, LOGIN_REDIRECT_URL

###
#   manage_tags
#   This is the initial screen for the manage tags interface where
#   the user chooses a group.
#
#   @param                  request             HTTP request object
#   @param                  message             The optional message to display
###
@login_required
def manage_tags(request, message):
    
    # Get all of the user's groups
    groups = request.user.groups.all()
    
    return render_to_response('manage.html',{
        'message' : message,
        'groups' : groups,
        },RequestContext(request));

###
#   manage_group_tags
#   This is the controller for the manage tags interface, after
#   the user has selected a group whos tags to edit.
#
#   @param          request
#   @param          group_id            The id of the Group object
###        
@login_required
def manage_group_tags(request, group_id):
    # get group object
    group = Group.objects.get(pk = group_id)
    # tags for this group
    tags = Tag.objects.filter(group = group).filter(isFixture = 0);
    
    # If user is in this group
    if request.user.groups.filter(id = group_id):
        return render_to_response('manage_group_tags.html', {
            'group' : group,
            'tags' : tags,

        })
    else :
        message = 'Please choose a group which you are a member of'
        # User not in this group redirect back to manage_tags
        return HttpResponseRedirect('/tags/manage/%s/' % message)

@login_required
def confirm_delete_tag(request, tagID):
    # get tag object
    tag = Tag.objects.get(pk = tagID)
    
    # Make sure user is allowed to delete this tag
    if request.user.groups.filter(id = tag.group.id) :
        tag_segments_table = render_to_string('tag_segments_table.html', {'tag' : tag, 'segments' : tag.segments.all() })
        return render_to_response('confirm_delete_tag.html', {'tag' : tag, 'segments' : tag.segments.all(), 'tag_segments_table' : tag_segments_table })
    else :
        raise Http404
    
  
@login_required
def delete_tag(request, tagID):
    # get tag object
    tag = Tag.objects.get(pk = tagID)
    
    # If this tag is not a fixture
    if not tag.isFixture :
        # Delete tag and all segments that have only this tag.
        tag.delete()
    
    return render_to_response('delete_success.html')

    
###
#   update_tag_name
#   This controller can be called via ajax to change a tag name.
#   tagID and newTagName are sent in via POST.  Checks to make sure
#   name entered is not blank, and changes tag name.
#
#   @param          request             HTTP request object
#                   POST['tagName']     The new tag name
#                   POST['tagID']       The id of the Tag object
###
@login_required
def update_tag_name(request):
    # Char field object for validation
    f = forms.CharField()
    
    try :
        # Get input tag name (will throw error if name is blank)
        newTagName = f.clean(request.POST['tagName'])
        # get tag object
        tag = Tag.objects.get(pk = request.POST['tagID'])
        # Change name of tag
        tag.tag = newTagName
        # Save
        tag.save()
    except ValidationError, e:
        # Name is probably blank
        error = 'A name is required.'

    response = HttpResponse(mimetype='text/plain')

    # If an error variable was defined in this scope
    if 'error' in locals() :
        response.write(error)
    else :
        response.write('success')
    return response
    
@login_required
def get_tag_segments(request, tagID):
    # Get tag object
    tag = Tag.objects.get(pk = tagID)
    
    # Make sure user is in the group that this tag belongs to
    if request.user.groups.filter(id = tag.group.id) :
        return render_to_response('tag_segments_table.html', {'tag' : tag, 'segments' : tag.segments.all() })
    else :
        raise Http404
    
    