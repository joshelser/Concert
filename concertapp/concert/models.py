from django.db import models
from django.contrib.auth.models import User
from django.contrib import admin

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
    admin = models.ForeignKey('User', {'related_name': 'admin'})

class Tag(models.Model):
    segment = models.ForeignKey('AudioSegment', {'related_name': 'segments'})
    group = models.OneToOneField('Group', {'related_name': 'group'})
    tag = models.CharField(max_length = 100)
    isProject = models.BooleanField()
    isFixture = models.BooleanField()
 
class Comment(models.Model):
    comment = models.TextField()
    user = models.OneToOneField('User', {'related_name': 'user'})
    time = models.DateTimeField(auto_now_add = True)
    segment = models.OneToOneField('AudioSegment', {'related_name': 'segment',
        'null': True})
    tag = models.OneToOneField('Tag', {'related_name': 'tag', 'null': True})
 
class Audio(models.Model):
    file = models.CharField(max_length = 100, unique = True)
    wav = models.CharField(max_length = 100, unique = True)
    user = models.ForeignKey('User', {'related_name': 'user'})
   
admin.site.register(Blogpost)
