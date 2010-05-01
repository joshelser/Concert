import unittest

from django.test import TestCase
from django.test.client import Client
from django.conf import settings

from concertapp.models import *
from django.contrib.auth.models import Group, User

import os

class ConcertTest(TestCase):
    #fixtures = ['user.json']

    def setUp(self):
        self.client = Client()

        # An alternative to not getting a fixture to load...
        #u = User.objects.get(username = 'test')
        #u.set_password('test')
        #u.save()

    def login(self, username = 'josh', password = 'josh'):
        response = self.client.post('/users/login/', {
            'username': username,
            'password': password,
            'next': settings.LOGIN_REDIRECT_URL,
            }
        )

        self.assertEquals(response.status_code, 302)
        self.assert_(response['Location'].endswith(settings.LOGIN_REDIRECT_URL))


class UserTest(ConcertTest):
    #fixtures = ['users.json']

    def test_login_needed(self):
        response = self.client.get('/')

        self.assertEquals(response.status_code, 302)
        self.assert_(response['Location'].endswith('?next=/'))
    
    def test_login(self):
        response = self.client.get('/')

        self.assertEquals(response.status_code, 302)
        self.assert_(response['Location'].endswith('?next=/'))

        super(UserTest, self).login()

        response = self.client.get('/')
        self.assertEquals(response.status_code, 200)

class GroupTest(ConcertTest):
    def test_view_all_groups(self):
        # Login
        super(GroupTest, self).login()

        # Request the page
        response = self.client.get('/groups/')

        # Should get a 200 OK response
        self.assertEquals(response.status_code, 200)

    def test_view_join_group_page(self):
        super(GroupTest, self).login()
        response = self.client.get('/groups/join/2/')

        self.assertEquals(response.status_code, 200)

    def test_request_to_join_group(self):
        super(GroupTest, self).login()

        response = self.client.post('/groups/join/submit/', {
            'group_id': 2
            }
        )

        self.assertEquals(response.status_code, 302)

        test_user = User.objects.get(username = 'josh')
        test_group = Group.objects.get(pk = 2)
        try:
            ugRequest = UserGroupRequest.objects.filter(user = test_user,
                    group = test_group)
        except UserGroupRequest.DoesNotExist:
            self.fail('There is no matching request in the database')

        self.failUnlessEqual(len(ugRequest), 1)



class AudioTest(ConcertTest):
    #fixtures = ['users.json']
    
    def test_view_audio(self):
        response = self.client.get('/audio/')

        self.assertEquals(response.status_code, 200)

    def test_wav_upload_audio(self):
        # Login
        super(AudioTest, self).login()

        f = open(os.path.join(settings.BASE_DIR, '../web/media/Oddity.wav'))
        response = self.client.post('/audio/upload/', {'wavfile': f})
        f.close()

        self.assertEquals(response.status_code, 302)
        self.assert_(response['Location'].endswith('/audio/'))

        # View the audio file
        response = self.client.get('/audio/1/')

        self.assertEquals(response.status_code, 200)

    def test_ogg_upload_audio(self):
        # Login
        super(AudioTest, self).login()

        #login = self.client.login(username = 'testuser', password = 'test')

        #self.assertTrue(login)

        f = open(os.path.join(settings.BASE_DIR, '../web/media/Oddity.ogg'))
        response = self.client.post('/audio/upload/', {'wavfile': f})
        f.close()

        self.assertEquals(response.status_code, 302)
        self.assert_(response['Location'].endswith('/audio/'))

        # View the audio file
        response = self.client.get('/audio/1/')

        self.assertEquals(response.status_code, 200)
