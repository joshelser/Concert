from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.views.generic.create_update  import create_object
from django.views.generic.simple import direct_to_template
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import Group
from django import forms
from django.core import serializers
from django.http import Http404

from django.conf import settings

from concertapp.models import *
from concertapp.forms   import UploadFileForm, CreateSegmentForm,RenameSegmentForm

@login_required
def index(request):

    ###
    #   Groups
    ###
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

    ###
    #   Tags
    ###
    # Get all of this group's tags
    tag_list = Tag.objects.filter(group = selected_group)

    # Get selected tag, or just use default tag
    try:
        # use selected tag if one was specified
        selected_tag_id = request.GET['selected_tag_id']
        selected_tag = Tag.objects.get(pk = selected_tag_id)
        # Get all of this tag's audio segments
        segment_list = selected_tag.segments.all()
        # no tag was selected
    except KeyError:
        # Get all tags from this group
        selected_tag = Tag.objects.filter(group = selected_group)
        segment_list = []
        all_segments = AudioSegment.objects.all()
        # For each segment
        for segment in all_segments :
            # For each of the selected tags
            for tag in selected_tag:
                # If this tag is one of the segment's tags
                if segment.tag_set.filter(id = tag.id).count() > 0 :
                    # Add to our segment list
                    segment_list.append(segment)
                    # Move on to next segment
                    break
    


    return render_to_response('index.html', {
    'no_show' : "no_show",
    'group_list': group_list, 
    'selected_group': selected_group, 
    'tag_list' : tag_list, 
    'selected_tag' : selected_tag,
    'segment_list' : segment_list
    }, RequestContext(request))


###
#   edit
#   The edit page for an audio file.
#
#   @param          segment_id          The ID of the requested segment.
#   @param          group_id            The ID of the group whose tags and segments we're currently viewing.
###
@login_required
def edit(request, segment_id, group_id):
    # Requested audio segment
    audioSegment = AudioSegment.objects.get(pk = segment_id)
    # Other audio segments associated with this audio file
    otherAudioSegments = AudioSegment.objects.filter(audio = audioSegment.audio)
    # Group
    group = Group.objects.get(pk = group_id)

    # Tags for the requested segment in json format
    jsonTags = serializers.serialize('json', audioSegment.tag_set.all())
    
    createSegmentForm = CreateSegmentForm()
    renameSegmentForm = RenameSegmentForm()
    
    return render_to_response('edit.html',{
        'waveformEditorSrc' : audioSegment.audio.waveformEditor.url,
        'waveformViewerSrc' : audioSegment.audio.waveformViewer.url,
        'createSegmentForm' : createSegmentForm,
        'renameSegmentForm' : renameSegmentForm,
        'audioSegment' : audioSegment,
        'audio_id' : audioSegment.audio.id,
        'segment_id': segment_id,
        'group_id' : group_id,
        'jsonTags' : jsonTags,
        'user'     : request.user,
        },RequestContext(request));
    
@login_required
def download_segment(request, segment_id, group_id, type):
    group = Group.objects.get(pk = group_id)

    if group not in request.user.groups.all():
        raise Http404

    return HttpResponse('temp')

@login_required
def new_segment_submit(request):
    if request.method == 'POST':
        # Create the form
        form = CreateSegmentForm(request.POST)
        
        if form.is_valid():
            print 'valid'
            # Get the tag name
            tag_name = form.cleaned_data['tag_field']

            # Save the form/segment
            segment = form.save(commit=False)

            # Explicitly set name
            segment.name = form.cleaned_data['label_field']
            group_id = request.POST['group_id']
            audio_id = request.POST['audio_id']

            # Set parent audio file
            segment.audio = Audio.objects.get(pk = audio_id)
            
            # Get the specified group
            group = Group.objects.get(pk = group_id)

            # Get or make the tag
            try:
                tag = Tag.objects.get(tag = tag_name)
            except Tag.DoesNotExist:
                # Doesn't exist, create tag 
                tag = Tag(group = group, tag = tag_name, isProject = 0,
                        isFixture = 0)

            segment.save()

            tag.save()

            newTag = Tag.objects.get(pk = tag.id)

            newTag.segments.add(segment)

            newTag.save()

            response = HttpResponse(mimetype='text/plain')
            response.write('success')
            return response
        else :
            
            print 'invalid'+repr(form.errors)
            response = HttpResponse(mimetype='text/plain')
            response.write('Error: validating form')
            return response


    response = HttpResponse(mimetype='text/plain')
    response.write('failure')
    return response




###
#   delete_segment
#   Part of the manage segment use case.  Deletes a given segment from the 
#   system
#
#   @param  segment_id      the id of the segment to be deleted
### 
@login_required 
def delete_segment(request,segment_id):
    # Requested audio segment
    AudioSegment.objects.get(pk = segment_id).delete()
    
    response = HttpResponse(mimetype='text/plain')
    response.write('success')
    return response   
    
    
###
#   rename_segment
#   Part of the manage segment use case.  renames a given segment 
#
### 
@login_required 
def rename_segment(request):
    if request.method == 'POST':

        form = RenameSegmentForm(request.POST)
        
        if form.is_valid:

            the_id = request.cleaned_data['id_field']

            segment = AudioSegment.objects.get(pk = the_id)
            #TODO why doesn't form.clean_data['label_field'] work here?
            segment.name = request.cleaned_data['label_field']
            segment.save()
            
            response = HttpResponse(mimetype='text/plain')
            response.write('success')
            return response
        else:
            print 'invalid'+repr(form.errors)
            response = HttpResponse(mimetype='text/plain')
            response.write('Error: validating form')
            return response
    
    response = HttpResponse(mimetype='text/plain')
    response.write('shouldn\'t be renaming a via anything but post')
    return response




###
#   admin
#   The admin page for a user
#
###
@login_required
def admin(request):

    user_id = request.user.id
    
    #upload file
    uploadFileForm = UploadFileForm()
    
    #list joinable groups
    g = Group.objects.all()
    joinGroups = list()
    inGroup = False
    for group in g:
        try:
            request.user.groups.get(name = group.name)
        except Group.DoesNotExist:
            joinGroups.append(group)
        
    message = None
    if request.GET.__contains__('message'):
        message = request.GET['message']    
    
    #list requests to join this groups
    myGroups = GroupAdmin.objects.filter(admin = request.user)

    return render_to_response('admin.html',{
      'uploadFileForm':uploadFileForm,
      'joinGroups': joinGroups,
      'message': message,
      'myGroups':myGroups,
      'length':len(myGroups),
      'user_id': user_id,
      'show_create': True
      
      
      
      
      });
    
    
    
    
    
    
