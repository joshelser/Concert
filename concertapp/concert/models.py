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
	email = models.CharField(max_length = 50)

class Comments(models.Model):
	comment = models.TextField()
	uid = models.ForeignKey(User)
	time = models.DateTimeField(auto_now_add = True)
	
class Group(models.Model):
	gname = models.CharField(max_length = 50, unique = True)
	admin = models.ForeignKey(User)
	
class Audio(models.Model):
	file = models.CharField(max_length = 100, unique = True)
	source = models.ForeignKey(User)
	wav = models.CharField(max_length = 100, unique = True)

class GroupAudio(models.Model):
	gid = models.ForeignKey(Group)
	cid = models.ForeignKey(Comments)
	label = models.TextField()
	
class AudioSegment(models.Model):
	beginning = models.DecimalField(max_digits = 10, decimal_places = 2)
	end = models.DecimalField(max_digits = 10, decimal_places = 2)

class Tags(models.Model):
	sid = models.ForeignKey(AudioSegment)
	aid = models.ForeignKey(GroupAudio)
	gid = models.ForeignKey(Group)
	tag = models.CharField(max_length = 100)
	isProject = models.BooleanField()
	
class UserGroup(models.Model):
	uid = models.ForeignKey(User)
	gid = models.ForeignKey(Group)

class AudioGroup(models.Model):
	aid = models.ForeignKey(Audio)
	gid = models.ForeignKey(Group)
	
	

admin.site.register(Blogpost)
