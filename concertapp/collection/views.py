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
    
    #   Serialize results into JSON response (must also serialize parent classes as
    #   described here:
    #   http://docs.djangoproject.com/en/dev/topics/serialization/#inherited-models)
    
    #   But we don't need the collection objects right now because there are no 
    #   attributes of interest
    #all_objects = list(Collection.objects.all()) + list(Group.objects.all())
    all_objects = list(Group.objects.all())
    json_serializer = serializers.get_serializer('json')()
    serializers.serialize('json', all_objects, fields=('name'), stream=response)
    print response
    
    return response
    
##
#    Create a collection
#
#   @param  request.POST['collection_name']        String  - The name of the new collection.
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

        

        return HttpResponse('success')
    else:
        return HttpResponse('failure')
        
    
    
