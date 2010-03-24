
from piston.handler import BaseHandler, AnonymousBaseHandler
from piston.utils import rc, require_mime, require_extended
from piston.utils import validate


from concertapp.concert.models import *
from concertapp.concert.forms import *

class BlogpostHandler(BaseHandler):
    """
    Authenticated entrypoint for blogposts.
    """
    model = Blogpost
    anonymous = 'AnonymousBlogpostHandler'
    fields = ('id', 'title', 'content', ('author', ('username',)), 
              'created_on', 'content_length')

    @classmethod
    def content_length(cls, blogpost):
        return len(blogpost.content)

    @classmethod
    def resource_uri(cls, blogpost):
        return ('blogposts', [ 'json', ])

    def read(self, request, *args, **kwargs):
        qs = self.queryset(request)
        if args != () or kwargs != {}:
            try:
                return qs.get(*args, **kwargs)
            except ObjectDoesNotExist:
                return rc.NOT_FOUND
            except MultipleObjectsReturned: # should never happen, since we're using a PK
                return rc.BAD_REQUEST
        else:
            return qs

    @validate(BlogpostForm, 'POST')
    def create(self, request):
        """
        Creates a new blogpost.
        """
        if not hasattr(request, "data"):
            request.data = request.POST
        attrs = self.flatten_dict(request.data)
        if self.exists(**attrs):
            return rc.DUPLICATE_ENTRY
        else:
            post = Blogpost(title=attrs['title'], 
                            content=attrs['content'],
                            author=request.user)
            post.save()
            return post

    @validate(BlogpostForm, 'PUT')
    def update(self, request, *args, **kwargs):
        if not self.has_model():
            return rc.NOT_IMPLEMENTED

        pkfield = self.model._meta.pk.name

        if pkfield not in kwargs:
            # No pk was specified
            return rc.BAD_REQUEST

        try:
            inst = self.queryset(request).get(pk=kwargs.get(pkfield))
        except ObjectDoesNotExist:
            return rc.NOT_FOUND
        except MultipleObjectsReturned: # should never happen, since we're using a PK
            return rc.BAD_REQUEST

        attrs = self.flatten_dict(request.POST)
        for k,v in attrs.iteritems():
            setattr( inst, k, v )

        inst.save()
        return rc.ALL_OK
        

class AnonymousBlogpostHandler(BlogpostHandler, AnonymousBaseHandler):
    """
    Anonymous entrypoint for blogposts.
    """
    fields = ('title', 'content', 'created_on')

class UserHandler(AnonymousBaseHandler):
    model = User
    fields = ('id', 'name', 'passwd', 'email')

    def create(self, request):
        print request
        pass

    def read(self, request, *args, **kwargs):
        pass
