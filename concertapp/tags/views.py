#from django.contrib.auth.models import Group, User
from concertapp.forms   import CreateCommentForm
from concertapp.models  import *
from concertapp.settings import MEDIA_ROOT, LOGIN_REDIRECT_URL
from django import forms
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.forms.util import ValidationError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.template.loader import render_to_string


###
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

###
#   This is the controller for the confirm page when you are deleting a tag.
#
#   @param              request         
#   @param              tagID               The id of the Tag object about to be deleted.
###
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
    
###
#   Delete a tag and all segments that only have this tag.
#
#   @param              request
#   @param              tagID               The id of the Tag object to delete
###
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

###
#   Retrieves the table of segments associated with the given tag.  Can be used
#   whenever all segments for a tag need to be displayed.
#
#   @param              request
#   @param              tagID               The id of the Tag object whose segments we are displaying
###
@login_required
def get_tag_segments(request, tagID):
    # Get tag object
    tag = Tag.objects.get(pk = tagID)
    
    # Make sure user is in the group that this tag belongs to
    if request.user.groups.filter(id = tag.group.id) :
        return render_to_response('tag_segments_table.html', {'tag' : tag, 'segments' : tag.segments.all() })
    else :
        raise Http404

###
#   Adds the given tag to the given segment, creating the tag if it does not exist.
#
#   @param                  request
#   @param                  groupID                 The id of the group in which this tag is to be created
#   @param                  segmentID               The id of the segment object 
#   @param                  tag                     The text of the tag to add to the segment
###
@login_required
def add_tag_to_segment(request, groupID, segmentID, tag):
    
    # Get this segment
    segment = AudioSegment.objects.get(pk = segmentID)
    # Get this group
    group = Group.objects.get(pk = groupID)
    
    # Char field object for validation
    f = forms.CharField()
    
    try:
        # Get input tag name (error is thrown if blank)
        newTagName = f.clean(tag)
        # Get tag object if exists
        tag = Tag.objects.get(tag = newTagName)
        if tag.segments.filter(id = segment.id):
            error = 'Segment already has this tag'
        else:
            # Add this segment to the current tag's segments
            tag.segments.add(segment)
    except ValidationError:
        # Name is blank
        error = 'A name is required.'
    # Tag with this name does not exist
    except Tag.DoesNotExist:
        # Create new tag object
        newTag = Tag(group = group, tag = newTagName, isProject = 0, isFixture = 0)
        newTag.save()
        newTag.segments.add(segment)
        newTag.save()
        
    
    
    response = HttpResponse(mimetype='text/plain')
    
    # If an error variable was defined in this scope
    if 'error' in locals() :
        response.write(error)
    else :
        response.write('success')
    return response


    
    
###
#   Leave a comment on a tag
#
#   @param  segment_id
#   @param  group_id
###
@login_required
def comment(request,tagID, groupID):
    if request.method == 'POST':
        
        # Create the form
        form = CreateCommentForm(request.POST)
        
        if form.is_valid() : 
            
            # Get the group
            group = Group.objects.get(pk = groupID)
             
            # Make sure the current user is a member of this group
            if group not in request.user.groups.all():
                raise Http404

            # Get the tag
            try:
                tag = Tag.objects.get(pk = tagID)
            except Tag.DoesNotExist:
                raise Http404
                
            #create the comment
            comment = form.save(commit=False)
            
            #set the user
            comment.user = request.user
            
            #set the segment
            comment.tag = tag
            
            #save the comment
            comment.save()
            
                
            return HttpResponseRedirect('/?selected_tag_id=' + str(tag.id))
        else:
            response = HttpResponse(mimetype='text/plain')
            response.write(form.errors)
            return response
    else:
        return Http404
        
           
