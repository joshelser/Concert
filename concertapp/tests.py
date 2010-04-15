import unittest

from django.test.client import Client
from django.conf import settings

from concertapp.models import *

import os

class ConcertTest(unittest.TestCase):
    #fixtures = ['users']

    def setUp(self):
        self.client = Client()

        # An alternative to not getting a fixture to load...
        u = User.objects.get(username = 'testuser')
        u.set_password('test')
        u.save()

    def login(self, password='test'):
        response = self.client.post('/users/login/', {
            'username': 'testuser',
            'password': password
            }
        )

        self.assertEquals(response.status_code, 302)
        self.asssert_(response['Location'].endswith(settings.LOGIN_REDIRECT_URL))


class UserTest(ConcertTest):
    #fixtures = ['users.json']
    
    def test_sanity(self):
        response = self.client.get('/')

        self.assertEquals(response.status_code, 200)

class AudioTest(ConcertTest):
    #fixtures = ['users.json']
    
    def test_view_audio(self):
        response = self.client.get('/audio/')

        self.assertEquals(response.status_code, 200)

    def test_wav_upload_audio(self):
        # Login
        login = self.client.login(username = 'testuser', password = 'test')

        self.assertTrue(login)

        f = open(os.path.join(settings.BASE_DIR, '../web/media/Oddity.wav'))
        response = self.client.post('/audio/upload/', {'wavfile': f})
        f.close()

        self.assertEquals(response.status_code, 302)
        self.assert_(response['Location'].endswith('/audio/'))

    def test_view_wav_audio(self):
        # Database is cleared after every test
        response = self.client.get('/audio/1/')

        self.assertEquals(response.status_code, 200)

    def test_ogg_upload_audio(self):
        # Login
        login = self.client.login(username = 'testuser', password = 'test')

        self.assertTrue(login)

        f = open(os.path.join(settings.BASE_DIR, '../web/media/Oddity.ogg'))
        response = self.client.post('/audio/upload/', {'wavfile': f})
        f.close()

        self.assertEquals(response.status_code, 302)
        self.assert_(response['Location'].endswith('/audio/'))

    def test_view_ogg_audio(self):
        # Database is cleared after every test
        response = self.client.get('/audio/1/')

        self.assertEquals(response.status_code, 200)
