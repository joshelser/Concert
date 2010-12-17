from concertapp.models import *
from django.contrib.auth.models import User

import unittest

###
#   This test creates a user, and creates a collection, then the user requests
#   to join this collection.
###
class UserCollectionRequestTestCase(unittest.TestCase):
    
    def setUp(self):
        user = User.objects.create(username='test', password='test')
        admin = User.objects.create(username='testadmin', password='testadmin')
        collection = Collection.objects.create(name='test', admin=admin)
        self.user = user
        self.admin = admin
        self.collection = collection
        
    def runTest(self):
        self.collection.add_request(self.user)
        
###
#   In this test, a user requests to join a collection (as above), then the
#   request is accepted.
###
class UserCollectionRequestAcceptTestCase(UserCollectionRequestTestCase):
    
    def setUp(self):
        super(UserCollectionRequestAcceptTestCase, self).setUp()
        
    def runTest(self):
        super(UserCollectionRequestAcceptTestCase, self).runTest()
        
        # Accept join request
        self.collection.accept_request(self.user)
        
###
#   In this case the user requests to join a collection, then the request is
#   removed.
###
class UserCollectionRequestRemoveTestCase(UserCollectionRequestTestCase):
    
    def setUp(self):
        super(UserCollectionRequestRemoveTestCase, self).setUp()
        
    def runTest(self):
        super(UserCollectionRequestRemoveTestCase, self).runTest()
        
        # Remove join request
        self.collection.remove_request(self.user)
