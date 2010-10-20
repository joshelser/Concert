from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.template import RequestContext



##
# The upload_audio page.  User goes here to upload audio to a specific collection.
#
# @param    request HTTP Request
##
@login_required
def upload_audio(request):
    user = request.user
    
    username = user.username
    
    
    return render_to_response('upload_audio.html', {
        'page_name': 'Upload Audio'
    }, RequestContext(request));
