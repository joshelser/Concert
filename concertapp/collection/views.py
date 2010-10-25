from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.core import serializers
from django.contrib.auth.models import User
from django import forms
from django.contrib.auth.models import Group, User
from concertapp.models import Collection
from concertapp.collection.forms import CreateCollectionForm
from django.core.exceptions import ObjectDoesNotExist



##
# The manage_collections page, shows what facebook friends have collections, and
# allows you to request to join their collection.  Also has options for creating a 
# collection and inviting your facebook friends to join it.
#
##
@login_required
def manage_collections(request):
    user = request.user
    
    
    return render_to_response('manage_collections.html', {
        'page_name': 'Settings',
    }, RequestContext(request));


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

    #   Serialize results into JSON response        
    json_serializer = serializers.get_serializer('json')()
    serializers.serialize('json', results, fields=('name'), stream=response)
    
    return response
    
##
#    Create a collection
#
#   @param  request.POST['name']        String  - The name of the new collection.
##
@login_required
def create_collection(request):
    
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
        
    
    
