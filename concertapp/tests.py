from concertapp.models import *
from django.contrib.auth.models import User

from django.http import HttpRequest
from django.contrib.auth import authenticate, login
import json

# For random string generation
import random
import string


import unittest
from django.test import TestCase as DjangoTestCase

    




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
        
        