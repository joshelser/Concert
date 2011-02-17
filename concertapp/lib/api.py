from concertapp.lib.api import *
from tastypie.authentication import Authentication, BasicAuthentication
from tastypie.authorization import DjangoAuthorization, Authorization
from tastypie.bundle import Bundle
from tastypie.http import *
from tastypie.resources import ModelResource, Resource
from tastypie import fields
from django.conf.urls.defaults import url
from tastypie.utils import is_valid_jsonp_callback_value, dict_strip_unicode_keys, trailing_slash
import sys

###
#   Just make sure that the user is logged into Django
###
class DjangoAuthentication(Authentication):
    """Authenticate based upon Django session"""
    def is_authenticated(self, request, **kwargs):
        return request.user.is_authenticated()


    
class ConcertAuthorization(Authorization):
    def is_authorized(self, request, object=None):
        #   User must be logged in, authentication backend should have set
        #   request.user
        if not hasattr(request, 'user'):
            return False
            
        return True

###
#   This is for things that we need on each resource.
###
class MyResource(ModelResource):
    
    class Meta:
        
        # incase we need to pass around the request in awkward ways.
        request = None
    
    
    ###
    #   This method is used anytime the data needs to be retrieved as a 
    #   python dict.  TODO: Determine if there is a better way to do this.
    ###
    def as_dict(self, request):
        
        # Get objects
        objs = self.get_object_list(request)
        # Get dehydrated bundles
        objsBundles = [self.full_dehydrate(obj=obj) for obj in objs]
        
        ###
        #   A helper function that will get the dicts of any sub-bundles.
        ###
        def get_recursive_bundle_data(attr):
            # If we are looking at a bundle
            if type(attr) == Bundle:
                # We will re-construct all of the attributes as dicts, they
                # are currently either bundles or attributes.
                data = {}
                # For each attribute
                for key in attr.data:
                    # Get bundle data
                    data[key] = get_recursive_bundle_data(attr.data[key])
            # If we are looking at list, must run this function on elements
            elif type(attr) == list:
                data = [get_recursive_bundle_data(x) for x in attr]
            # we are looking at an attribute, just pass it back through recursion.
            else:
                data = attr
                
            return data
            
        # For each of our objects, get dict as mentioned above.
        objsDicts = [get_recursive_bundle_data(bundle) for bundle in objsBundles]

        return objsDicts

    ###
    #   This method returns the serialized object upon creation, instead of 
    #   just the uri to it.
    ###
    def post_list(self, request, **kwargs):
        deserialized = self.deserialize(request,
            request.raw_post_data,
            format=request.META.get('CONTENT_TYPE',
            'application/json')
        )
        bundle = self.build_bundle(data=dict_strip_unicode_keys(deserialized))
        self.is_valid(bundle, request)
        updated_bundle = self.obj_create(bundle, request=request)
        resp = self.create_response(request,
            self.full_dehydrate(updated_bundle.obj)
        )
        resp['location'] = self.get_resource_uri(updated_bundle)
        resp.code = 201
        return resp        
        
    ###
    #   This helps us with nested resources.
    #   source: https://gist.github.com/809993
    ###                      
    def override_urls(self):
        urls = []

        for name, field in self.fields.items():
            if isinstance(field, fields.ToManyField):
                print field.to_class
                resource = r"^(?P<resource_name>{resource_name})/(?P<{related_name}>.+)/{related_resource}/$".format(
                    resource_name=self._meta.resource_name, 
                    related_name=field.related_name,
                    related_resource=field.attribute,
                    )
                resource = url(resource, field.to_class().wrap_view('get_list'), name="api_dispatch_detail")
                urls.append(resource)
        return urls
