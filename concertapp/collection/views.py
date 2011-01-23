from concertapp.collection.forms import CreateCollectionForm
from concertapp.models import Collection
from django import forms
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core import serializers
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, HttpResponseRedirect
from django.template.response import TemplateResponse
from django.template import RequestContext
from django.utils import simplejson
import json
import sys
from urlparse import parse_qs
from urllib import urlencode


from concertapp.collection.api import *



##
# The manage_collections page, shows what facebook friends have collections, and
# allows you to request to join their collection.  Also has options for creating a 
# collection and inviting your facebook friends to join it.
#
##
@login_required
def manage_collections(request):
    user = request.user
    
    ar = AdminCollectionResource()
    ur = UserRequestResource()
    
    data = {
        'adminCollections': ar.as_dict(request),
        'requests': ur.as_dict(request),
    }
    
    

    return TemplateResponse(request, 'collections/manage_collections.html', {
        'page_name': 'Collections',
        'js_page_path': '/collections/',
        'data': data, 
    })


##
#   An ajax request that returns a JSON object of collection names and ids.  This
#   should be enhanced at some point to sort by relevance, etc.
#
#   @param  query        String  - the search query
##
@login_required
def search_collections(request, query):
    user = request.user
    
    # Get exact match if one exists
    try:
        exact = Collection.objects.get(name=query)
        exact = True
    except ObjectDoesNotExist:
        exact = False
            
    #   Create object with properties that we will serialize
    cr = CollectionResource()
    cr.set_search_term(query)
    resultsDicts = cr.as_dict(request)

    #   Serialize results into JSON response        
    return HttpResponse(
        simplejson.dumps({
            'results': resultsDicts, 
            'exact': exact, 
        }),
        content_type = 'application/json'
    )
    
        


###
#   Retrieve a JSON object of the info associated with a collection
@login_required
def collection_info(request, collection_id):
    user = request.user
    
    # Get collection
    collection = Collection.objects.get(pk = collection_id)
    
    # Create object to serialize 
    result = {
        'id': collection.id, 
        'name': collection.name, 
        'users': [], 
    }
    # Build user data into object
    for user in collection.users.all():
        result['users'].append({
            'id': user.id, 
            'username': user.username, 
        })
        
    #   Serialize results into JSON response        
    return HttpResponse(
        simplejson.dumps(result),
        content_type = 'application/json'
    )
    
###
#   User decides to revoke join request
###
@login_required
def revoke_request(request, collection_id):
    user = request.user
    
    collection = Collection.objects.get(pk = collection_id)
    
    response = {
        'status': 'error or success', 
        'notification': '', 
    }
    
    try:
        collection.remove_request(user)
        response['status'] = 'success'
    except Exception, e:
        response['notification'] = str(e)
        response['status'] = 'error'
    return HttpResponse(simplejson.dumps(response), content_type='application/json')
    
###
#   Administrator denies a join request.  This is different than revoke_request 
#   because request.user must be the administrator of the group.
###
@login_required
def deny_request(request, collection_id, user_id):
    
    user = User.objects.get(pk = user_id)
    
    collection = Collection.objects.get(pk = collection_id)
    
    response = {}
    if request.user != collection.admin:
        response['status'] = 'error'
        response['notification'] = 'You do not have sufficient privileges.'
    else:
        try:
            collection.remove_request(user)
            response['status'] = 'success'
        except Exception, e:
            response['notification'] = str(e)
            response['status'] = 'error'

    return HttpResponse(simplejson.dumps(response), content_type='application/json')
    
###
#   Administrator approves a join request.
###
@login_required
def approve_request(request, collection_id, user_id):
    user = User.objects.get(pk = user_id)
    collection = Collection.objects.get(pk = collection_id)
    
    response = {}
    if request.user != collection.admin:
        raise Exception('You do not have sufficient privileges.')
    else:
        collection.accept_request(user)
        return HttpResponse()
    
