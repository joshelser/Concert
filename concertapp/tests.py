
from concertapp.models import *

from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import HttpRequest
from django.test import TestCase as DjangoTestCase
import json
import random, string, os
import unittest

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
        
        api_prefix = '/api/1/'


        # collection administrator should be able to view request
        #resp = self.client.get('/api/1/request/'+str(self.request.id)+'/', data={'format': 'json'})
        # Should be allowed because user2 made the request
        #self.assertEqual(resp.status_code, 200)
        

        
        # tag not created yet
        resp = self.client.get(os.path.join(api_prefix, "tag/1/"))
        self.assertEqual(resp.status_code, 410) #make sure API doesn't return anything 
        self.assertQuerysetEqual(Tag.objects.filter(pk=1),[]) #make sure there truely isn't anything to return


        # create a tag
        resp = self.client.put(os.path.join(api_prefix, "tag/1/"), 
                      data = '{"name":"new_tag","creator":"/api/1/user/1/","collection":"/api/1/collection/1/"}',
                      content_type = 'application/json')
        self.assertEqual(resp.status_code, 201) #make sure API created tag
        try:
            Tag.objects.get(name = "new_tag")
        except Tag.DoesNotExist:
            self.fail("tag wasn't created")

        # try and grab the created tag
        resp = self.client.get(os.path.join(api_prefix, "tag/1/"))
        self.assertEqual(resp.status_code, 200) #make sure API gets the created tag

        
