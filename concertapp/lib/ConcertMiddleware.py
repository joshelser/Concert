from concertapp.collection.api import *

from django.utils import simplejson


###
# Allows certain data to be "bootstrapped" into place, i.e. sent to each template
# where it is applicable.
# @class
###
class ConcertBootstrapDataMiddleware(object):
    def process_template_response(self, request, response):
        user = request.user
        
        if 'data' not in response.context_data:
            response.context_data['data'] = {}

        if user.is_authenticated():                
            # Data for user object
            userResource = UserResource()
            dehydratedUser = userResource.full_dehydrate(obj=user)
            response.context_data['data']['userData'] = dehydratedUser.data
            
            # Data for collections to which the user is a member
            r = MemberCollectionResource()
            r.set_user(user)
            response.context_data['data']['memberCollectionsData'] = r.as_dict(request)
            
        
        response.context_data['data'] = simplejson.dumps(response.context_data['data'])

        return response
