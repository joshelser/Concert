import unittest

from django.test import TestCase
from django.test.client import Client
from django.conf import settings

from concertapp.models import *
from django.contrib.auth.models import Group, User

import os

##
#    Generic class for testing Concert
##
class ConcertTest(TestCase):
    ##
    #   Gets called upon creation of a ConcertTest object
    ##
    def setUp(self):
        self.client = Client()

        # An alternative to not getting a fixture to load...
        #u = User.objects.get(username = 'test')
        #u.set_password('test')
        #u.save()

    ##
    #   Logs the user in. Defaults to 'josh':'josh' if no password is given
    ##
    def login(self, username = 'josh', password = 'josh'):
        response = self.client.post('/users/login/', {
            'username': username,
            'password': password,
            'next': settings.LOGIN_REDIRECT_URL,
            }
        )

        self.assertEquals(response.status_code, 302)
        self.assert_(response['Location'].endswith(settings.LOGIN_REDIRECT_URL))


##
#    Tests out generic user functionality
##
class UserTest(ConcertTest):
    ##
    #   Makes sure that the login_required decorator is working
    ##
    def test_login_needed(self):
        response = self.client.get('/')

        self.assertEquals(response.status_code, 302)
        self.assert_(response['Location'].endswith('?next=/'))
    
    ##
    #   Tests logging into the system
    ##
    def test_login(self):
        response = self.client.get('/')

        self.assertEquals(response.status_code, 302)
        self.assert_(response['Location'].endswith('?next=/'))

        super(UserTest, self).login()

        response = self.client.get('/')
        self.assertEquals(response.status_code, 200)

##
#   Tests out the group functionality
##
class GroupTest(ConcertTest):
    ##
    #   Make sure we can see all of the groups
    ##
    def test_view_all_groups(self):
        # Login
        super(GroupTest, self).login()

        # Request the page
        response = self.client.get('/groups/')

        # Should get a 200 OK response
        self.assertEquals(response.status_code, 200)

    ##
    #   Make sure no one can view any of the other pages
    ##
    def test_view_others_groups(self):
        # Login
        super(GroupTest, self).login()

        # The pages of another user
        pages = ('/users/2/groups/',
                 '/users/2/groups/create/',
                 '/users/2/groups/manage/',
                 '/users/2/groups/2/',
                 '/users/2/manage/2/pending_requests/',
                 '/users/2/manage/2/remove_user/',
                 '/users/2/manage/2/delete/')

        # Should not be able to access any of these pages
        for page in pages:
            response = self.client.get(page)

            self.assertEquals(response.status_code, 404)

    ##
    #   Create a new group
    ##
    def test_create_new_group(self):
        groupName = 'laksjdflask389025'
        # Login
        super(GroupTest, self).login()

        # Make sure we can view the add group page
        response = self.client.get('/users/1/groups/create/')

        # Ensure 200 OK
        self.assertEquals(response.status_code, 200)

        # POST the form
        response = self.client.post(
                '/users/1/groups/create/',
                {'group_name': groupName})

        # Should redirect back to the user's group page
        self.assertEquals(response.status_code, 302)
        self.assert_(response['Location'].endswith(
            '/users/1/groups/'))

        # Get the new group
        groups = Group.objects.filter(name = groupName)
        
        # Should have one group
        self.assertEquals(len(groups), 1)

    ##
    #   Try to create a group with a duplicate name
    ##
    def test_create_group_duplicate_name(self):
        groupName = 'josh'

        # Login
        super(GroupTest, self).login()

        # Make sure we can view the add group page
        response = self.client.get('/users/1/groups/create/')

        # Ensure 200 OK
        self.assertEquals(response.status_code, 200)

        # POST the form
        response = self.client.post(
                '/users/1/groups/create/',
                {'group_name': groupName})

        # Should redirect back to the user's group page
        self.assertEquals(response.status_code, 200)

        # Try the new group
        groups = Group.objects.filter(name = groupName)
        
        # Should have the already created group
        self.assertEquals(len(groups), 1)

    ##
    #   Join a group and make sure the request exists in the system
    ##
    def test_request_to_join_group(self):
        # Login
        super(GroupTest, self).login()

        # GET the page
        response = self.client.get('/groups/join/2/')

        # Make sure we got a 200 OK
        self.assertEquals(response.status_code, 200)

        # POST the data
        response = self.client.post('/groups/join/submit/', {
            'group_id': 2
            }
        )

        # Make sure we get redirected to the right page
        self.assertEquals(response.status_code, 302)
        self.assert_(response['Location'].endswith(
            '/admin/?message=Group%20request%20sent%20successfully'))

        # Get the user and the group
        test_user = User.objects.get(username = 'josh')
        test_group = Group.objects.get(pk = 2)

        # Try to pull the request from the database
        try:
            ugRequest = UserGroupRequest.objects.filter(user = test_user,
                    group = test_group)
        except UserGroupRequest.DoesNotExist:
            self.fail('There is no matching request in the database')

        # Make sure we got our result
        self.failUnlessEqual(len(ugRequest), 1)

    ##
    #   Accept a request that was left on one of your groups
    ##
    def test_accept_user_request(self):
        # Create a request from Josh to group Jason (group_id = 2)
        self.test_request_to_join_group()

        # Logout the user
        self.client.logout()

        # Log in as the owner of that group
        super(GroupTest, self).login(username = 'jason', password = 'jason')

        # Accept the request
        response = self.client.post(
            '/users/2/groups/manage/2/accept_request/1/submit/')

        # Check the redirection
        self.assertEqual(response.status_code, 302)
        self.assert_(response['Location'].endswith(
            '/users/2/groups/manage/2/pending_requests/'))

        # Get all the requests for that user and group
        requests = UserGroupRequest.objects.filter(user__id = 1, group__id = 2)

        # Should have no requests as we processed them
        self.assertEqual(len(requests), 0)

    ##
    #   Remove a user from a group
    ##
    def test_remove_user_from_group(self):
        # Insert the user into the group
        self.test_accept_user_request()

        # Make sure we can get to the proper page
        response = self.client.get('/users/2/groups/manage/2/remove/1/')

        self.assertEqual(response.status_code, 200)

        # Remove the user
        response = self.client.post(
            '/users/2/groups/manage/2/remove/1/submit/')

        # Verify the http
        self.assertEqual(response.status_code, 302)
        self.assert_(response['Location'].endswith(
            '/users/2/groups/manage/2/remove_user/'))

        # Get the groups of id = 2 for user of id = 1
        user_groups = User.objects.get(pk = 1).groups.filter(pk = 2)

        # We should have no such groups
        self.assertEquals(len(user_groups), 0)


##
#   Test the audio functionality of the system
##
class AudioTest(ConcertTest):
    ##
    #   Make sure we can view the audio page
    ##
    def test_view_audio(self):
        # Login
        super(AudioTest, self).login()

        # GET the list of audio files uploaded
        response = self.client.get('/audio/')

        # Make sure we got a 200 OK
        self.assertEquals(response.status_code, 200)

    ##
    #   Upload a wav file and make sure it made it into the system
    ##
    def test_wav_upload_audio(self):
        # Login
        super(AudioTest, self).login()

        # Get the wav file
        f = open(os.path.join(settings.BASE_DIR, '../web/media/Oddity.wav'))
        response = self.client.post('/audio/upload/', {'wavfile': f})
        f.close()

        # Make sure we get redirected to the right place
        self.assertEquals(response.status_code, 302)
        self.assert_(response['Location'].endswith('/audio/'))

        # View the audio file
        response = self.client.get('/audio/1/')

        # Make sure we can view the audio file
        self.assertEquals(response.status_code, 200)

        # Get the audio object just uploaded
        songs = Audio.objects.all()

        # Make sure there's an audio song in the db
        self.assertEquals(len(songs), 1)

        # Make sure we can view the segment
        self.view_audio_segment(songs[0].id, 1) 

    ##
    #   Upload an ogg file and make sure it made it into the system
    ##
    def test_ogg_upload_audio(self):
        # Login
        super(AudioTest, self).login()

        # Send the ogg file to Concert
        f = open(os.path.join(settings.BASE_DIR, '../web/media/Oddity.ogg'))
        response = self.client.post('/audio/upload/', {'wavfile': f})
        f.close()

        # Make sure we get redirected to the right place
        self.assertEquals(response.status_code, 302)
        self.assert_(response['Location'].endswith('/audio/'))

        # View the audio file
        response = self.client.get('/audio/1/')

        # File should be available for viewing
        self.assertEquals(response.status_code, 200)

        # Get the audio object just uploaded
        songs = Audio.objects.all()

        # Make sure there's an audio song in the db
        self.assertEquals(len(songs), 1)

        # Make sure we can get there to view it
        self.view_audio_segment(songs[0].id, 1)

    def view_audio_segment(self, segment_id, group_id):
        response = self.client.get('/edit/'+str(segment_id)+'/'+str(group_id)+'/')

        self.assertEquals(response.status_code, 200)
