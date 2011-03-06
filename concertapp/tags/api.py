from concertapp.lib.api import *
from concertapp.models import *
from concertapp.users.api import *
from concertapp.collection.api import CollectionResource
from django.conf.urls.defaults import *
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from tastypie import fields
from tastypie.authentication import Authentication, BasicAuthentication
from tastypie.authorization import DjangoAuthorization, Authorization
from tastypie.constants import ALL, ALL_WITH_RELATIONS
from tastypie.resources import convert_post_to_put
from tastypie.http import *
from tastypie.exceptions import NotFound, BadRequest, InvalidFilterError, HydrationError, InvalidSortError, ImmediateHttpResponse

###
#   Make sure that the user who is trying to modify the board is the administrator.
###
class TagAuthorization(ConcertAuthorization):
    def is_authorized(self, request, object=None):
        
        if super(TagAuthorization, self).is_authorized(request, object):
            #   Get is always allowed, since we're just requesting information about
            #   the collection.
            if request.method == 'GET':
                return True
            
            #   If there is an object to authorize
            if object:
                #   Make sure that the person modifying is in the collection that the tag belongs to.
                return (request.user in object.collection.users.all())
            else:
                #   TODO: This currently is always the case (tastypie issues)
                return True
        else:
            return False

class TagResource(MyResource):
    creator = fields.ForeignKey(UserResource, 'creator', full=True)
    collection = fields.ForeignKey(CollectionResource, "collection", full = True)
    segments = fields.ToManyField('concertapp.audiosegments.api.AudioSegmentResource','segments', null = True)

    class Meta:
        authentication = DjangoAuthentication()
        authorization = TagAuthorization()
        queryset = Tag.objects.all()
        filtering = {
            "segments": ALL,
            }        

        nested = 'segments'

    def nested_dispatch_list(self, request, **kwargs):
        if "nested_pk" not in kwargs:
            raise Exception('Nested resource views need to be provided with a nested pk (primary key) in order to function')

        return self.nested_dispatch('list', request, **kwargs)

    def nested_dispatch_detail(self, request, **kwargs):
        if "nested_pk" not in kwargs:
            raise Exception('Nested resource views need to be provided with a nested pk (primary key) in order to function')

        return self.nested_dispatch('detail', request, **kwargs)
    
    def nested_dispatch(self, request_type, request, **kwargs):
        """
        Handles the common operations (allowed HTTP method, authentication,
        throttling, method lookup) surrounding most CRUD interactions.
        """
        allowed_methods = getattr(self._meta, "%s_allowed_methods" % request_type, None)
        request_method = self.method_check(request, allowed=allowed_methods)
        
        method = getattr(self, "nested_%s_%s" % (request_method, request_type), None)

        if method is None:
            raise ImmediateHttpResponse(response=HttpNotImplemented())
        
        self.is_authenticated(request)
        self.is_authorized(request)
        self.throttle_check(request)
        
        # All clear. Process the request.
        request = convert_post_to_put(request)
        response = method(request, **kwargs)
        
        # Add the throttled request.
        self.log_throttled_access(request)

        # If what comes back isn't a ``HttpResponse``, assume that the
        # request was accepted and that some action occurred. This also
        # prevents Django from freaking out.
        if not isinstance(response, HttpResponse):
            return HttpAccepted()

        return response


    def get_nested_obj_type(self):
        if not self._meta.nested:
            return None

        field_string = getattr(self._meta, 'nested', None)
        field = getattr(self, field_string, None)

        return field.to_class()._meta.object_class
        
        
    def nested_post_list(self, request, **kwargs):
        '''
        the view function thats going to handle POST requests to nested resources where the non-nested resource 
        (the latter of the two specified in the URL) is left as a list.

        e.g.,
        POSTing to a resource like this /api/nested_resource/nested_pk/resource

        note the lack of a primary key for the <italic>regular</italic> resource.

        in this case, it is assumed that the resource is being created new, and therefore the nested resoruce
        can just be injected in as a related object, since theres no chance of it overwritting anything.
        '''
        

        nested_item = get_object_or_404(self.get_nested_obj_type(),pk=kwargs['nested_pk'])
        kwargs['segments'] = nested_item
        return self.post_list(request, **kwargs)


    def nested_post_detail(self, request, **kwargs):
        '''
        the view function thats going to handle POST requests to nested resource where the non-nested resource
        already exists.

        e.g., 
        POSTing to a resource who's url looks like htis /api/nested_resource/nested_pk/resource/pk

        in this case, this function should only create the relationship between the two items.  Nothing should be specified in the POST
        arguments
        '''

        nested_item = get_object_or_404(self.get_nested_obj_type(), pk = kwargs['nested_pk'])
        non_nested_item = get_object_or_404(self._meta.object_class, pk = kwargs['pk'])        
        try:
            non_nested_related_field = getattr(non_nested_item, self._meta.nested)
        except AttributeError, e:
            Exception("Couldn't find attribute %s on %s. Make sure the resource's field name matches the django model's name." % (self._meta.nested, str(type(non_nested_item)))) 
            
        non_nested_related_field.add(nested_item)
        return HttpCreated(location=self.get_resource_uri(non_nested_item))  
        

    def remove_api_resource_names(self, url_dict):
        kwargs_subset = super(TagResource, self).remove_api_resource_names(url_dict)
        
        for key in ['nested_pk', 'nested_resource_name']:
            try:
                del(kwargs_subset[key])
            except KeyError:
                pass
        
        return kwargs_subset    

    def override_urls(self):
        '''
        TODO: The only supported operations on nested resources will be POST and DELETE, because otherwise you should be dealing with the resource directly. 
        Therefore, we need to write views (aka dispatchers for POST and DELETE, on both the detail and list versions of the URLS.
        This is your task.  It is discrete and feasible. Fucking do it already.
        '''
        override_urls = []

        override_urls.extend([
            url(r"^nested/(?P<nested_resource_name>%s)/(?P<nested_pk>\w[\w-]*?)/(?P<resource_name>%s)/(?P<pk>\w[\w-]*?)%s$" % ('audiosegment', self._meta.resource_name, trailing_slash()), 
             self.wrap_view('nested_dispatch_detail')),
            url(r"^nested/(?P<nested_resource_name>%s)/(?P<nested_pk>\w[\w-]*?)/(?P<resource_name>%s)%s$" % ('audiosegment', self._meta.resource_name, trailing_slash()), 
             self.wrap_view('nested_dispatch_list'))
            ])
        
        return override_urls
        


