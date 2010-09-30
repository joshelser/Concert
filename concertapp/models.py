from django.db import models
from django.contrib.auth.models import User, Group
from django.contrib import admin
from django.core.files.storage import FileSystemStorage
from django.core.files  import File
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import SimpleUploadedFile


from django.conf import settings
from concertapp.audio import audioFormats, audioHelpers
from concertapp.settings import MEDIA_ROOT

import commands #debugging

import audiotools

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
    mp3file = models.FileField(upload_to = 'audio/')
    user = models.ForeignKey(User, related_name = 'uploader')
    waveformViewer = models.ImageField(upload_to = 'images/viewers')
    waveformEditor = models.ImageField(upload_to = 'images/editors')

    ###
    #   Create ogg and mp3 file from .wav
    #
    #   @throws     audiotools.EncodingError    -   Upon encoding error
    def create_ogg_and_mp3(self):
        self.create_ogg()
        self.create_mp3()
    
    ###
    #   Create ogg file from .wav
    #   
    #   @throws     audiotools.EncodingError    -   Upon encoding error
    def create_ogg(self):
        # Get name of wav file
        wavFileName = os.path.split(str(self.wavfile))[-1]
        
        # take .wav off end, and replace with .ogg
        oggFileName = wavFileName.split('.')[:-1]
        oggFileName = '.'.join(oggFileName)+'.ogg'
        

        # Input wav file path
        wavFilePath = os.path.join(MEDIA_ROOT, 'audio', wavFileName)
                
        # Create dummy Django file object so we can get the name that Django
        #   wants to use for this file.
        #   ( I tried getting around this by putting the ogg, mp3, and wav in
        #   separate folders, but it seems the only way is to create your own
        #   storage class. )
        oggFile = SimpleUploadedFile(oggFileName, 'a')
        self.oggfile = oggFile
        self.save()
        
        # Destination of ogg file (Django probably changed the filename)
        oggFilePath = os.path.join(MEDIA_ROOT, str(self.oggfile))
        
        
        #   Convert .wav file to ogg and put it proper place.  Can throw
        #   EncodingError.
        audioHelpers.toOgg(wavFilePath, oggFilePath)
        
        
    ##
    #   Create mp3 file from .wav
    #
    #   @throws audiotools.EncodingError        - Upon encoding error        
    def create_mp3(self):
        # Get name of wav file
        wavFileName = os.path.split(str(self.wavfile))[-1]

        # take .wav off end and replace with .mp3
        mp3FileName = wavFileName.split('.')[:-1]
        mp3FileName = '.'.join(mp3FileName)+'.mp3'

        # Input wav file path
        wavFilePath = os.path.join(MEDIA_ROOT, 'audio', wavFileName)

        # Create dummy Django file object
        mp3File = SimpleUploadedFile(mp3FileName, 'a')
        # Save object with dummy file
        self.mp3file = mp3File
        self.save()
        
        # Destination of mp3 file
        mp3FilePath = os.path.join(MEDIA_ROOT, str(self.mp3file))
        
        #   Convert file to mp3 and put it in proper place.  Can throw
        #   EncodingError
        audioHelpers.toMp3(wavFilePath, mp3FilePath)
                

    # Delete the current audio file from the filesystem
    def delete(self, *args, **kwargs):
        # Remove wavfile
        path = os.path.join(settings.MEDIA_ROOT, str(self.wavfile))
        if os.path.exists(path):
            os.remove(path)
            
        # Remove oggfile if one still exists
        if(len(str(self.oggfile))):
            path = os.path.join(settings.MEDIA_ROOT, str(self.oggfile))
            if os.path.exists(path):
                os.remove(path)
        
        # Remove mp3file
        if(len(str(self.mp3file))):
            path = os.path.join(settings.MEDIA_ROOT, str(self.mp3file))
            if os.path.exists(path):
                os.remove(path)

        # Remove viewer
        if(len(str(self.waveformViewer))):
            path = os.path.join(settings.MEDIA_ROOT, str(self.waveformViewer))
            if os.path.exists(path):
                os.remove(path)

        # Remove editor image
        if(len(str(self.waveformEditor))):
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
    # Generate all the waveforms for this audio object.  Should transition
    # these audioFormats calls to the new audio library.
    #
    def generate_waveform(self):
        wavPath = str(self.wavfile)
        print "wavPath:\n"+str(wavPath)
        wavName = os.path.split(wavPath)[-1]
        print "wavName:\n"+str(wavName)
        # Create the wav object
        wavObj = audioFormats.Wav(os.path.join(MEDIA_ROOT, wavPath))
        length = wavObj.getLength()

        # Name of the image for the waveform viewer (small waveform image) 
        viewerImgPath = 'images/viewers/'+wavName + '_800.png'    
        wavObj.generateWaveform(os.path.join(MEDIA_ROOT, viewerImgPath), 800, 110)

        # Name of the image for the waveform editor (large waveform image)
        editorImgPath = 'images/editors/'+wavName + '_' + str(5 * length) + '.png'
        wavObj.generateWaveform(os.path.join(MEDIA_ROOT, editorImgPath), 5 * length, 585)

        # Save the path relative to the media_dir
        self.waveformViewer = viewerImgPath    
        self.waveformEditor = editorImgPath
        
    
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
