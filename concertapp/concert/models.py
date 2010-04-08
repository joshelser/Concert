from django.db import models
from django.contrib.auth.models import User
from django.contrib import admin
from django.core.files.storage import FileSystemStorage
from django.core.files.base import ContentFile

from concertapp.settings import MEDIA_ROOT
import os

class Blogpost(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.ForeignKey(User, related_name='posts')
    created_on = models.DateTimeField(auto_now_add=True)
    
    def __unicode__(self):
        return self.title

class RemovableFileField(models.FileField):
    def delete_file(self, instance):
        if getattr(instance, self.attname):
            file_name = getattr(instance, 'get_%s_filename' % self.name)()

            if os.path.exists(file_name):
                os.remove(file_name)


class AudioSegment(models.Model):
    name = models.CharField(max_length = 100)
    beginning = models.DecimalField(max_digits = 10, decimal_places = 2)
    end = models.DecimalField(max_digits = 10, decimal_places = 2)

class Group(models.Model):
    gname = models.CharField(max_length = 50, unique = True)
    admin = models.ForeignKey(User)

class Tag(models.Model):
    segment = models.ForeignKey('AudioSegment')
    group = models.OneToOneField('Group')
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
