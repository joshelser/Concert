from django.contrib.auth.decorators import login_required
from django.template import RequestContext
from django.template.response import TemplateResponse

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
    
    
    return TemplateResponse(request, 'dashboard/dashboard.html', {
        'page_name': 'Dashboard',
        'js_page_path': '/dashboard/',
    })
