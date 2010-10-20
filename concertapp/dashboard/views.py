from django.http import HttpResponse, HttpResponseRedirect
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
    
    username = user.username
    
    # If last time user logged on was not today
    last_login = user.last_login
    
    return render_to_response('dashboard.html', {
        'welcome_message': 'Welcome back to Concert, '+username+'.',
        'page_name': 'Dashboard',
        'last_login': last_login
    }, RequestContext(request));
