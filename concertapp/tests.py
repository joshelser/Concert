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