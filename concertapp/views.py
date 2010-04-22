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
from concertapp.forms   import UploadFileForm

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
    # no tag was selected
    except KeyError:
      # Use default tag
      selected_tag = Tag.objects.get(group = selected_group, tag = 'Uploads')
    
    ###
    #   AudioSegments
    ###
    # Get all of this tag's audio segments
    segment_list = selected_tag.segments.all()
    
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
    
    return render_to_response('edit.html',{
        'waveformEditorSrc' : audioSegment.audio.waveformEditor.url,
        'waveformViewerSrc' : audioSegment.audio.waveformViewer.url,
        'audioSegment' : audioSegment
        },RequestContext(request));
    


###
#   admin
#   The admin page for a user
#
#   @param          segment_id          The ID of the requested segment.
###
@login_required
def admin(request):
    form = UploadFileForm()
    
    
    
    return render_to_response('admin.html',{'form':form});
    


















