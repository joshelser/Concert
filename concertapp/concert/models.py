from django.db import models
from django.contrib.auth.models import User
from django.contrib import admin
from django.core.files.storage import FileSystemStorage
from django.core.files.base import ContentFile

audioStorage = FileSystemStorage(location='audio')

class Blogpost(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.ForeignKey(User, related_name='posts')
    created_on = models.DateTimeField(auto_now_add=True)
    
    def __unicode__(self):
        return self.title

class User(models.Model):
    name = models.CharField(max_length = 30, unique = True)
    passwd = models.CharField(max_length = 20)
    email = models.EmailField()

class AudioSegment(models.Model):
    name = models.CharField(max_length = 100)
    beginning = models.DecimalField(max_digits = 10, decimal_places = 2)
    end = models.DecimalField(max_digits = 10, decimal_places = 2)

class Group(models.Model):
    gname = models.CharField(max_length = 50, unique = True)
    admin = models.ForeignKey('User')

class Tag(models.Model):
    segment = models.ForeignKey('AudioSegment')
    group = models.OneToOneField('Group')
    tag = models.CharField(max_length = 100)
    isProject = models.BooleanField()
    isFixture = models.BooleanField()
 
class Comment(models.Model):
    comment = models.TextField()
    user = models.OneToOneField('User')
    time = models.DateTimeField(auto_now_add = True)
    segment = models.OneToOneField('AudioSegment', null = True)
    tag = models.OneToOneField('Tag', null = True)
 
class Audio(models.Model):
    fileName = models.CharField(max_length = 100, unique = True)
    wavFile = models.FileField(storage = audioStorage, upload_to = 'audio/')
    user = models.ForeignKey('User')
   
admin.site.register(Blogpost)
