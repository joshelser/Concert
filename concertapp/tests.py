from concertapp.models import *
from django.contrib.auth.models import User

from django.http import HttpRequest
from django.contrib.auth import authenticate, login
import json

import unittest
from django.test import TestCase as DjangoTestCase

###
#   This test creates a user, and creates a collection, then the user requests
#   to join this collection.
###
class UserCollectionRequestTestCase(unittest.TestCase):
    
    def setUp(self):
        # Helper to generate random strings
        def randomString(N):
            import random
            import string
            return ''.join(random.choice(string.ascii_uppercase + string.digits) for x in range(N))
            
        user = User.objects.create(username=randomString(5), password=randomString(5))
        admin = User.objects.create(username=randomString(5), password=randomString(5))
        collection = Collection.objects.create(name=randomString(5), admin=admin)
        self.user = user
        self.admin = admin
        self.collection = collection
        
    def runTest(self):
        # user requests to join the collection
        self.request = Request.objects.create(user = self.user, collection = self.collection)
        
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
        self.request.status = 'a'
        self.request.save()
        
        # Make sure that the user is now a member of the collection
        self.assertTrue(self.user in self.collection.users.all())
        
        # Make sure that the proper event was created
        JoinCollectionEvent.objects.get(new_user = self.user, collection = self.collection)
        
###
#   In this case the user requests to join a collection, then the request is
#   removed.
###
class UserCollectionRequestRemoveTestCase(UserCollectionRequestTestCase):
    
    def setUp(self):
        super(UserCollectionRequestRemoveTestCase, self).setUp()
        
    def runTest(self):
        super(UserCollectionRequestRemoveTestCase, self).runTest()
        
        # Reject join request
        self.request.status = 'd'
        self.request.save()
        
        # Make sure that the user is not a member of the collection
        self.assertFalse(self.user in self.collection.users.all())
        
        # Make sure that the proper event was created
        RequestDeniedEvent.objects.get(requesting_user = self.user, collection=self.collection)





###
#   Here we will test the API for requests (not yet working because authorization)
#   in tastypie is pooped
###
class RequestTestCase(DjangoTestCase):
    def setUp(self):
        self.adminUser = User.objects.create_user('test_user', 'testemail@somewhere.com', 'test_user')
        
        self.collection = Collection.objects.create(name='test_collection', admin=self.adminUser)
        
        self.requestingUser = User.objects.create_user('test_user2', 'testemail2@somewhere.com', 'test_user2')
        
        #self.request = self.collection.add_request(self.requestingUser)
        
    def runTest(self):
        
        # login as collection administrator
        resp = self.client.login(username='test_user', password='test_user')
        #self.assertEqual(resp, True)
        
        # collection administrator should be able to view request
        #resp = self.client.get('/api/1/request/'+str(self.request.id)+'/', data={'format': 'json'})
        # Should be allowed because user2 made the request
        #self.assertEqual(resp.status_code, 200)
        
        