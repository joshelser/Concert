from django.db import models
from django.contrib.auth.models import User, Group
from django.contrib import admin
from django.core.files.storage import FileSystemStorage
from django.core.files.base import ContentFile

from django.conf import settings
from concertapp.audio import audioFormats

import os, tempfile

class AudioSegment(models.Model):
    name = models.CharField(max_length = 100)
    beginning = models.DecimalField(max_digits = 10, decimal_places = 2)
    end = models.DecimalField(max_digits = 10, decimal_places = 2)
    audio = models.ForeignKey('Audio') # An audio segment is associated with a single audio object
    
    def tag_list(self):
      # Get all tags associated with this audio segment
      tags = self.tag_set.all()
      output = tags[0].tag
      if tags.count() > 1 :
        for i in range(len(tags)-1) :
            output += ', '+tags[i+1].tag
      return output
        

class GroupAdmin(models.Model):
    group = models.ForeignKey(Group) #models.CharField(max_length = 80, unique = True)
    admin = models.ForeignKey(User, related_name = 'administrator')

class UserGroupRequest(models.Model):
    user = models.ForeignKey(User, related_name = 'group_member')
    group = models.ForeignKey(Group) 

class Tag(models.Model):
    segments = models.ManyToManyField('AudioSegment')
    group = models.ForeignKey(Group)
    tag = models.CharField(max_length = 100)
    isProject = models.BooleanField()
    isFixture = models.BooleanField()
    
    def delete(self, *args, **kwargs):
        # Do not delete if this is a permanent tag
        if self.isFixture :
            return
        
        # Get all segments with this tag
        segments = self.segments.all()
        
        # For each segment
        for segment in segments :
            # If segment only has one tag, it is this one, so we can delete segment as well
            if segment.tag_set.count() == 1 :
                # delete segment
                segment.delete()
        
        # Delete tag using built-in delete method
        super(Tag, self).delete(*args, **kwargs)
        return
 
class Comment(models.Model):
    comment = models.TextField()
    user = models.ForeignKey(User, related_name = 'author')
    time = models.DateTimeField(auto_now_add = True)
    segment = models.ForeignKey('AudioSegment', null = True)
    tag = models.ForeignKey('Tag', null = True)
 
class Audio(models.Model):
    filename = models.CharField(max_length = 100)
    wavfile = models.FileField(upload_to = 'audio/')
    oggfile = models.FileField(upload_to = 'audio/')
    user = models.ForeignKey(User, related_name = 'uploader')
    waveformViewer = models.ImageField(upload_to = 'images/viewers')
    waveformEditor = models.ImageField(upload_to = 'images/editors')

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

    def mp3_to_ogg(self, originalFile):
        # Convert from mp3 to wav
        wavFileName = self.mp3_to_wav(originalFile)

        # Use the original filename as a prefix
        prefixName = os.path.split(wavFileName)[-1]

        # Create a random file for the created wav file
        tempFile = tempfile.mkstemp(suffix = '.ogg', prefix = prefixName)

        # Save the name of the new file
        newName = tempFile[1]

        # Create an wav object
        wavObj = audioFormats.Wav(wavFileName)

        # Encode the wav into ogg
        proc = wavObj.oggEncode(newName)

        proc.wait()

        print 'Finished converting wav to ogg'

        return newName

    def wavfilename_to_ogg(self, wavFileName):
        # Use the original filename as a prefix
        prefixName = os.path.split(wavFileName)[-1]

        # Create a random file for the created wav file
        tempFile = tempfile.mkstemp(suffix = '.ogg', prefix = prefixName)

        # Save the name of the new file
        newName = tempFile[1]

        # Create an wav object
        wavObj = audioFormats.Wav(wavFileName)

        # Encode the wav into ogg
        proc = wavObj.oggEncode(newName)

        proc.wait()

        print 'Finished converting wav to ogg'

        return newName

    def wav_to_ogg(self, originalFile):
         # Use the original filename as a prefix
        prefixName = str(originalFile)

        # Create a random file for the created wav file
        tempFile = tempfile.mkstemp(suffix = '.ogg', prefix = prefixName)

        # Save the name of the new file
        newName = tempFile[1]

        # Create an wav object
        wavObj = audioFormats.Wav(originalFile.temporary_file_path())

        # Encode the wav into ogg
        proc = wavObj.oggEncode(newName)

        proc.wait()

        print 'Finished converting wav to ogg'

        return newName

    # Delete the current audio file from the filesystem
    def delete(self, *args, **kwargs):
        # Remove wavfile
        path = os.path.join(settings.MEDIA_ROOT, str(self.wavfile))
        if os.path.exists(path):
            os.remove(path)

        # Remove oggfile
        path = os.path.join(settings.MEDIA_ROOT, str(self.oggfile))
        if os.path.exists(path):
            os.remove(path)

        # Remove viewer
        path = os.path.join(settings.MEDIA_ROOT, str(self.waveformViewer))
        if os.path.exists(path):
            os.remove(path)

        # Remove oggfile
        path = os.path.join(settings.MEDIA_ROOT, str(self.waveformEditor))
        if os.path.exists(path):
            os.remove(path)

        # Get all segments who have this audio object as its parent
        segments = AudioSegment.objects.filter(audio = self)

        # Delete all of the segments
        for segment in segments:
            segment.delete()

        # Send delete up
        super(Audio, self).delete(*args, **kwargs)

        return

##
# Given a user, it creates the corresponding group
#
# @param user The user object of the creator
# @param group_name The name of the group (optional)
# @param tag_is_fixture If the tag should be a fixture
#
def create_group_all(user, group_name = '', tag_is_fixture = 0):
    if group_name == '':
        group_name = user.username

    # Create user's default group
    new_group = Group(name = group_name)
    new_group.save()

    # Make the user the admin
    new_group_admin = GroupAdmin(group = new_group, admin = user)
    new_group_admin.save()
            
    # Add this user as a member of the new_group
    user.groups.add(new_group)

    # Create the default tag for all audio files uploaded by this user 
    # (fixture because it will not be able to be deleted)
    tag = Tag(group = new_group, isProject = 0, isFixture = tag_is_fixture, tag
            = 'Uploads')
    tag.save()

    return new_group
