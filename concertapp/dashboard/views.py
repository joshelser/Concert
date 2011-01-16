from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.template import RequestContext

from django.utils import simplejson

from concertapp.collection.api import *

##
# The dashboard page, what users see when they first log in.
#
# @param    request HTTP Request
##
@login_required
def dashboard(request):
    user = request.user
    
    r = MemberCollectionResource()
    r.set_user(user)
    
    data = {
        'memberCollections':r.as_dict(request), 
    }
    
    return render_to_response('dashboard/dashboard.html', {
        'page_name': 'Dashboard',
        'js_page_path': '/dashboard/',
        'data': simplejson.dumps(data), 
    }, RequestContext(request));
