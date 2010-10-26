from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.template import RequestContext



##
# The manage_collections page, shows what facebook friends have collections, and
# allows you to request to join their collection.  Also has options for creating a 
# collection and inviting your facebook friends to join it.
#
# @param    request HTTP Request
##
@login_required
def manage_collections(request):
    user = request.user
    
    
    return render_to_response('collections/manage_collections.html', {
        'page_name': 'Collections',
    }, RequestContext(request));
