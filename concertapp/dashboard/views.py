from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.template import RequestContext



##
# The dashboard page, what users see when they first log in.
#
# @param    request HTTP Request
##
@login_required
def dashboard(request):
    user = request.user
    
    return render_to_response('dashboard/dashboard.html', {
        'page_name': 'Dashboard',
        'js_page_path': '/dashboard/'
    }, RequestContext(request));
