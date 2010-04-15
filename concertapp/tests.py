import unittest

from django.test.client import Client

from concertapp.models import *

class ConcertTest(unittest.TestCase):
    def setUp(self):
        self.client = Client()

    def test_sanity(self):
        response = self.client.get('/')

        self.assertEquals(response.status_code, 200)

