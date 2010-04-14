from django.db import models
from django.contrib.auth.models import User
from django.contrib import admin
from django.core.files.storage import FileSystemStorage
from django.core.files.base import ContentFile

from django.conf import settings
from concertapp.concert.audio import audioFormats

import os, tempfile

class Blogpost(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.ForeignKey(User, related_name='posts')
    created_on = models.DateTimeField(auto_now_add=True)
    
    def __unicode__(self):
        return self.title

class AudioSegment(models.Model):
    name = models.CharField(max_length = 100)
    beginning = models.DecimalField(max_digits = 10, decimal_places = 2)
    end = models.DecimalField(max_digits = 10, decimal_places = 2)

class UserGroup(models.Model):
    gname = models.CharField(max_length = 80, unique = True)
    admin = models.ForeignKey(User)

class UserGroupMembers(models.Model):
    user = models.ForeignKey(User)
    group = models.ForeignKey(UserGroup)

class UserGroupRequest(models.Model):
    user = models.ForeignKey(User)
    gname = models.CharField(max_length = 80)

class Tag(models.Model):
    segment = models.ForeignKey('AudioSegment')
    group = models.OneToOneField('UserGroup')
    tag = models.CharField(max_length = 100)
    isProject = models.BooleanField()
    isFixture = models.BooleanField()
 
class Comment(models.Model):
    comment = models.TextField()
    user = models.OneToOneField(User)
    time = models.DateTimeField(auto_now_add = True)
    segment = models.OneToOneField('AudioSegment', null = True)
    tag = models.OneToOneField('Tag', null = True)
 
class Audio(models.Model):
    filename = models.CharField(max_length = 100)
    wavfile = models.FileField(upload_to = 'audio/')
    user = models.ForeignKey(User, related_name = 'audio')
    waveform = models.ImageField(upload_to = 'images/')

    def mp3_to_wav(self, originalFile):
        # Use the original filename as a prefix
        prefixName = str(originalFile)

        # Create a random file for the created wav file
        tempFile = tempfile.mkstemp(suffix = '.wav', prefix = prefixName)

        # Save the name of the new file
        newName = tempFile[1]

        # Create an mp3 object
        mp3Obj = audioFormats.Mp3(originalFile.temporary_file_path())

        # Decode the mp3 into wav
        proc = mp3Obj.mp3Decode(newName)

        proc.wait()

        print 'Finished converting mp3 to wav'

        return newName

    def ogg_to_wav(self, originalFile):
        # Use the original filename as a prefix
        prefixName = str(originalFile)

        # Create a random file for the created wav file
        tempFile = tempfile.mkstemp(suffix = '.wav', prefix = prefixName)

        # Save the name of the new file
        newName = tempFile[1]

        # Create an mp3 object
        oggObj = audioFormats.Ogg(originalFile.temporary_file_path())

        # Decode the mp3 into wav
        proc = oggObj.oggDecode(newName)

        proc.wait()

        print 'Finished converting ogg to wav'

        return newName

    # Delete the current audio file from the filesystem
    def delete_wavfile(self):
        print self.wavfile
        fullpath = os.path.join(MEDIA_ROOT, str(self.wavfile))
        if os.path.exists(fullpath):
            os.remove(fullpath)
            return True
        else:
            return False
   
admin.site.register(Blogpost)
