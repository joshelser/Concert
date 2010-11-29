from concertapp.collection.forms import CreateCollectionForm
from concertapp.models import Collection
from django import forms
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core import serializers
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.utils import simplejson
import json



##
# The manage_collections page, shows what facebook friends have collections, and
# allows you to request to join their collection.  Also has options for creating a 
# collection and inviting your facebook friends to join it.
#
##
@login_required
def manage_collections(request):
    user = request.user

    return render_to_response('collections/manage_collections.html', {
        'page_name': 'Collections',
        'js_page_path': '/collections/'
    }, RequestContext(request))


##
#   An ajax request that returns a JSON object of collection names and ids.
#
#   @param  query        String  - the search query
##
@login_required
def search_collections(request, query):
    user = request.user
    
    # Create response object
    response = HttpResponse(mimetype='application/json')

    #   Get collections that match criteria
    results = Collection.objects.filter(name__icontains=query)
    
    #   Create object with properties that we will serialize
    resultsDicts = []
    for result in results:
        obj = {
            'name': result.name, 
            'id': result.id, 
        }
        resultsDicts.append(obj)
    

    #   Serialize results into JSON response        
    return HttpResponse(
        simplejson.dumps(resultsDicts),
        content_type = 'application/json'
    )
    
##
#    Create a collection
#
#   @param  request.POST['name']        String  - The name of the new collection.
##
@login_required
def create_collection(request):
    if not(request.POST):
        return HttpResponseRedirect('/collections/')
        
    # Create new collection with current user as the admin
    col = Collection(admin=request.user)
    
    # Create form so we can validate collection name
    form = CreateCollectionForm(request.POST, instance=col)
    if form.is_valid():
        colname = form.cleaned_data['name']
        
        col = form.save()
        
        #   Add current user to collection
        col.users.add(request.user)
        
        return HttpResponse('success')
    else:
        return HttpResponse('failure')
        

###
#   Delete a collection
#
#   @param  request.POST['id']        String  - The id of the collection to delete.
###
@login_required
def delete_collection(request):
    if not(request.POST):
        return HttpResponseRedirect('/collections/')
    
    col = Collection.objects.get(pk=request.POST['id'])
    
    # Only the admin can delete the collection
    if(request.user == col.admin):    
        col.delete()
    
        return HttpResponse('success')
    else:
        return HttpResponse('error')
    
###
#   Retrieve a JSON list of the collections this user is associated with.
#
###
@login_required
def user_collections(request):
    
    user = request.user
    
    # Get all collections this user is a member of
    collections = user.collection_set.all()
    
    results = list()
    
    # For each of these collections
    for col in collections:
        
        # If the current user is the admin
        if col.admin == user:
            admin = 1
        else:
            admin = 0
        
        # Build json results
        results.append(dict({
            'name': col.name,
            'id': col.id,
            'num_users': col.users.all().count(),
            'admin': admin
        }))
        
    
    #   Serialize results into JSON response        
    return HttpResponse(
        simplejson.dumps(results),
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
#   User sends a collection join request
@login_required
def join_collection(request, collection_id):
    user = request.user
    
    collection = Collection.objects.get(pk = collection_id)
    
    # Wether or not we will return a generic error
    error = False
    
    # If user is already a member
    if user in collection.users.all():
        error = True
    # If user has already requested to join this collection
    elif collection in user.get_profile().collection_join_requests.all():
        error = True
    # we can add a request for this user
    else:
        user.get_profile().collection_join_requests.add(collection)
    
    if error:
        return HttpResponse('error', content_type='text/plain')
    else:
        return HttpResponse('success', content_type='text/plain')
    
