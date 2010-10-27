from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.core.cache import cache
from django.utils import simplejson
import os
import hashlib



##
# The upload_audio page.  User goes here to upload audio to a specific collection.
#
# @param    request HTTP Request
##
@login_required
def upload_audio(request):
    user = request.user
    
    username = user.username
    
    if request.method == 'POST':
        # The file being uploaded.
        print "request.FILES['audio']:\n"+str(request.FILES['audio'])
        
        # Generate a unique upload id so we can track progress of the upload
        upload_id = hashlib.sha224(os.urandom(16)).hexdigest()
        while(cache.get(upload_id) != None) :
            upload_id = hashlib.sha224(os.urandom(16)).hexdigest()
        
        #path = '/var/www/pictures/%s' % id
        #f = request.FILES['picture']
        #destination = open(path, 'wb+')
        #for chunk in f.chunks():
        #    destination.write(chunk)
        #destination.close()


        response = dict({
            'status': 'success',
            'upload_id': upload_id
        })

        #   Serialize results into JSON response        
        return HttpResponse(
            simplejson.dumps(response),
            content_type = 'application/json'
        )

        return HttpRequest('{}')
    else :        
        return render_to_response('audio/upload_audio.html', {
            'page_name': 'Upload Audio'
        }, RequestContext(request));
