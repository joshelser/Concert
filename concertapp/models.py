from concertapp.audio import audioFormats, audioHelpers
from concertapp.settings import MEDIA_ROOT
from django.conf import settings
from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.core.files  import File
from django.core.files.base import ContentFile
from django.core.files.storage import FileSystemStorage
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db import models
from django.db.models.signals import post_save, m2m_changed
import audiotools
import os, tempfile, sys



###
# An extension to the User model accomplished through the Django supported
# AUTH_PROFILE_MODULE.  Each 'ConcertUser' is linked to a django User      
# via a ForeginKey, thus allowing ConcertUser to hold extra attributes,    
# accessable via <User>.get_profile().<ConcertUser>.attribute              
###
class ConcertUser(models.Model):
    user = models.ForeignKey(User, unique = True)
    unread_events = models.ManyToManyField('Event')


###
# create_concert_user is a callback function used to create a ConcertUser
# - described above - simultaneously with the creation of a django User.
###
def create_concert_user_callback(sender, **kwargs):
    if sender != User:
        return
    
    user = kwargs['instance']
    if kwargs['created']:
        concert_user = ConcertUser(user = user)
        concert_user.save()
###
# create_concert_user is bound to the post_save signal.  So everytime a model 
# object gets saved, the create_concert_user checks if it's a User that is getting
# saved, then creates the ConcertUser  
###
post_save.connect(create_concert_user_callback)


###
# An abstract class (abstract by Concert semantics, not Django) used to house
# information for all the events that can occur on the system.  Built for logging
# purpose, not event triggered events, although that functionality could
# theoretically work using django signals.  
### 
class Event(models.Model):
    time = models.DateTimeField(auto_now_add = True)
    collection = models.ForeignKey('Collection')
    active = models.BooleanField(default=True)
    real_type = models.ForeignKey(ContentType, editable=False, null=True)

    ###
    # Only allow sub classes of Event to be saved, and when saving, determine the 
    # sub class' type and store it in real_type (e.g., TagCommentEvent, SegmentCommentEvent,
    # etc.)
    ###
    def save(self):
        if type(self)==Event:
            raise Exception("Event is abstract, but not through Django semantics (e.g., 'Class Meta: abstract = True' is NOT set).\nYou must use one of the Event subclasses")
        else:
            self.real_type = self._get_real_type()
            super(Event,self).save()
            for user in self.collection.users.all():
                user.get_profile().unread_events.add(self)

    def delete(self):
        if type(self)==Event:
            raise Exception("Event is abstract, but not through Django semantics (e.g., 'Class Meta: abstract = True' is NOT set).\nYou must use one of the Event subclasses")
        else:
            super(Event,self).delete()


    
    def _get_real_type(self):
        return ContentType.objects.get_for_model(type(self))

    ###
    # return the sub_class object thats associated with this tuple
    ###
    def cast(self):
        return self.real_type.get_object_for_this_type(pk=self.pk)

    def __unicode__(self):
        return str(self.cast())


class TagCommentEvent(Event):
    tag_comment = models.ForeignKey("TagComment", related_name = 'comment_event')

    def __unicode__(self):
        author = self.tag_comment.author
        tag = self.tag_comment.tag.name

        return str(author) + " commented on tag '" + str(tag) + "'."


class SegmentCommentEvent(Event):
    segment_comment = models.ForeignKey("SegmentComment", related_name = "comment_event" )

    def __unicode__(self):
        author = self.segment_comment.author
        segment = self.segment_comment.segment.name

        return str(author) + " commented on segment '" + str(segment) + "'."


class TagCreatedEvent(Event):
    tag = models.ForeignKey("Tag", related_name = "created_event")

    def __unicode__(self):
        creator = self.tag.creator
        tag = self.tag.name
        
        return str(creator) + " created tag '" + str(tag) + "'."


class AudioSegmentCreatedEvent(Event):
    audio_segment = models.ForeignKey("AudioSegment", related_name = "created_event")

    def __unicode__(self):
        creator = self.audio_segment.creator
        audio_segment = self.audio_segment.name

        return str(creator) + " created segment '" + str(audio_segment) + "'."
    

class AudioSegmentTaggedEvent(Event):
    audio_segment = models.ForeignKey("AudioSegment", related_name = "tagged_event")
    tag = models.ForeignKey("Tag", related_name = "tagged_event")
    tagging_user = models.ForeignKey(User, related_name = "tagged_event")

    def __unicode__(self):
        return str(self.tagging_user) + " tagged '" + str(self.audio_segment.name) + "' with tag '" + str(self.tag.name)


class AudioUploadedEvent(Event):
    audio = models.ForeignKey("Audio", related_name = "audio_uploaded_event")

    def __unicode__(self):
        return str(self.audio.uploader) + " uploaded file '" + self.audio.name + "'."


class JoinCollectionEvent(Event):
    new_user = models.ForeignKey(User)

    def __unicode__(self):
        return str(self.new_user) + " joined " + str(self.collection)        

class RequestJoinCollectionEvent(Event):
    requesting_user = models.ForeignKey(User)
    
    def __unicode__(self):
        return str(self.requesting_user) + " requested to join " + str(self.collection)

class AudioSegment(models.Model):
    name = models.CharField(max_length = 100)
    beginning = models.DecimalField(max_digits = 10, decimal_places = 2)
    end = models.DecimalField(max_digits = 10, decimal_places = 2)
    audio = models.ForeignKey('Audio')
    collection = models.ForeignKey('Collection')
    creator = models.ForeignKey(User)

    
    def tag(self, tag_name, user):
        try:
            tag = Tag.objects.get(name = tag_name)
        except Tag.DoesnNotExist:
            tag = Tag(name = tag_name, collection = self.collection)
            tag.save()

        self.tags.add(tag)

    def tag_list(self):
        tags = self.tag_set.all()
        return ', '.join(tags)
    
    def save(self):
        super(AudioSegment,self).save()
        event = AudioSegmentCreatedEvent(audio_segment = self, collection = self.collection)
        event.save()

    def delete(self):
        for event in AudioSegmentCreatedEvent.objects.filter(audio_segment = self):
            event.active = False

        for event in AudioSegmentTaggedEvent.objects.filter(audio_segment = self):
            event.active = False

        super(AudioSegment,self).delete()


###
#   A collection is a group of users that manage audio files together.  This is 
#   basically just a group, with an admin user.
###     
class Collection(models.Model):
    name = models.CharField(max_length = 100, unique=True)
    admin = models.ForeignKey(User)
    users = models.ManyToManyField(User, related_name = "collections")
    requesting_users = models.ManyToManyField(User, related_name = "collection_join_requests")

    def add_user(self,user):
        if user in self.users.all():
            raise Exception("User can't join a collection they're already in")

        if user not in self.requesting_users.all():
            raise Exception("You can't add a user to a collection they haven't requested ot join")
        
        self.users.add(user)
        self.save()

        JoinCollectionEvent(new_user = user, collection = self).save()      

    def add_request_to_join(self,user):
        if user not in User.objects.all():
            raise Exception("user dne")

        if user in self.users.all():
            raise Exception("User can't request to join a collection they're already in")

        self.requesting_users.add(user)
        
        RequestJoinCollectionEvent(requesting_user = user, collection = self).save()
        
        self.save()
        

    def save(self):
        super(Collection, self).save()
        if self.users.count() == 0:
            self.users.add(self.admin)
            JoinCollectionEvent(new_user = self.admin, collection = self).save()

        super(Collection, self).save()
        
    def __unicode__(self):
        return str(self.name)


class Tag(models.Model):
    segments = models.ManyToManyField('AudioSegment', related_name = "tags", editable = 'False')
    collection = models.ForeignKey('Collection')
    name = models.CharField(max_length = 100)
    time = models.DateTimeField(auto_now_add = True)
    creator = models.ForeignKey(User)

    def save(self):
        super(Tag, self).save()
        event = TagCreatedEvent(tag = self, collection = self.collection)
        event.save()

    def delete(self):
        # Get all segments with this tag
        segments = self.segments.all()
        
        # For each segment
        for segment in segments :
            # If segment only has one tag, it is this one, so we can delete segment
            if segment.tag_set.count() == 1 :
                # delete segment
                segment.delete()
        
        #Make all unread TagCreatedEvents read                
        for event in TagCreatedEvent.objects.filter(tag = self):
            event.active = False

        #Make all unread TagCommentEvent read
        for event in TagCommentEvent.objects.filter(tag_comment__tag = self):
            event.active = False

        # Delete tag using built-in delete method
        super(Tag, self).delete()


###
# In order for tagging to be hooked into the event system, everytime you
# tag a segment, we need to create a TagCreatedEvent.  To do this, we create
# the AudioSegment.tag(...) function, and so we want to disallow all other forms
# of adding AudioSegments to a Tag object
###


def create_tag_event_callback(sender, **kargs):
    if type(kargs['instance']) != Tag:
        return

    if not kargs['reverse']:
        raise Exception('You can only tag segments via <AudioSegment>.tag(...)')
m2m_changed.connect(create_tag_event_callback)


###
# A Concert-abstract (as oppsoed to django abstract) Super class for all the comment types
###
class Comment(models.Model):
    comment = models.TextField()
    author = models.ForeignKey(User)
    time = models.DateTimeField(auto_now_add = True)

    def save(self):
        if type(self)==Comment:
            raise Exception("Comment is abstract, but not through Django semantics (e.g., 'Class Meta: abstract = True' is NOT set ).\nYou must use one of the Comment subclasses")
        else:
            self.real_type = self._get_real_type()
            super(Comment,self).save()            
            
    def delete(self):
        if type(self)==Comment:
            raise Exception("Comment is abstract, but not through Django semantics (e.g., 'Class Meta: abstract = True' is NOT set ).\nYou must use one of the Comment subclasses")
        else:
            super(Comment,self).delete()            
    
            
    def _get_real_type(self):
        return ContentType.objects.get_for_model(type(self))

    ###
    # return the sub_class object thats associated with this tuple
    ###
    def cast(self):
        return self.real_type.get_object_for_this_type(pk=self.pk)
    
    def __unicode__(self):
        return str(cast(self))


class TagComment(Comment):
    tag = models.ForeignKey('Tag')

    def __unicode__(self):
        return "Tag Comment: " + self.comment[:10] + "..."

    def save(self):
        super(TagComment,self).save()
        event = TagCommentEvent(tag_comment = self,collection = self.tag.collection)
        event.save()

    def delete(self):
        for event in TagCommentEvent.objects.filter(tag=self.tag):
            event.active = False

        super(TagComment,self).delete()
    

class SegmentComment(Comment):
    segment = models.ForeignKey("AudioSegment")

    def __unicode__(self):
        return "Segment Comment: " + self.comment[:10] + "..."

    def save(self):
        super(SegmentComment,self).save()
        event = SegmentCommentEvent(segment_comment = self,collection = self.segment.collection)
        event.save()

    def delete(self):
        for event in SegmentCommentEvent.objects.filter(segment=self.segment):
            event.active = False

        super(SegmentComment,self).delete()
    

class Audio(models.Model):
    name = models.CharField(max_length = 100)
    wavfile = models.FileField(upload_to = 'audio/')
    oggfile = models.FileField(upload_to = 'audio/')
    mp3file = models.FileField(upload_to = 'audio/')
    uploader = models.ForeignKey(User)
    waveformViewer = models.ImageField(upload_to = 'images/viewers')
    waveformEditor = models.ImageField(upload_to = 'images/editors')
    collection = models.ForeignKey('Collection')

    ###
    #   Do everything necessary when an audio object is first created.
    #   
    #   @param  f        File object from request.FILES
    #
    #   @throws     audiotools.EncodingError - upon encoding error
    #   @throws     probably other stuff.
    def init(self, f):
        # Get original filename of uploaded file
        name = str(f)
        self.name = name
        
        wavName = name+'.wav'
        oggName = name+'.ogg'
        mp3Name = name+'.mp3'
        
        # grab the path of the temporary uploaded file.  This is where the user's
        #   uploaded file exists currently.
        inputFilePath = f.temporary_file_path()
        
        #   Create files with dummy contents but with proper names.
        self.wavfile.save(wavName, SimpleUploadedFile(wavName, 'temp contents'))
        self.oggfile.save(oggName, SimpleUploadedFile(oggName, 'temp contents'))
        self.mp3file.save(mp3Name, SimpleUploadedFile(mp3Name, 'temp contents'))
        
        #   Now we have an auto-generated name from Python, and we know where
        #   we should put the converted audio files
        
        # The input is the temporary uploaded file location
        wavInput = f.temporary_file_path()
        # output was determined above
        wavOutput = os.path.join(MEDIA_ROOT, self.wavfile.name)
        
        #   the ogg file will be encoded from the normalized wav file
        oggInput = wavOutput
        oggOutput = os.path.join(MEDIA_ROOT, self.oggfile.name)
        
        #   and so will the mp3
        mp3Input = wavOutput
        mp3Output = os.path.join(MEDIA_ROOT, self.mp3file.name)
        
        
        
        #   now overwrite the dummy files with the actual encodes
        
        # We will first normalize the wav file (convert to proper sample rate,
        #   etc). NOTE: this doesn't actually mean "normalize" to 0db, but 
        #   hopefully in the future.
        audioHelpers.toNormalizedWav(wavInput, wavOutput)
        
        #   Do the same for ogg
        audioHelpers.toOgg(oggInput, oggOutput)
        
        #   and mp3
        audioHelpers.toMp3(mp3Input, mp3Output)
        
        # Generate the waveform onto disk
        self.generate_waveform()

        self.save()
        
        event = AudioUploadedEvent(audio = self, collection = self.collection)
        event.save()
        
        
        
        

    # Delete the current audio file from the filesystem
    def delete(self):
        
        # Remove wavfile from this object, and delete file on filesystem.
        if(self.wavfile and os.path.exists(self.wavfile.name)):
            # These lines should delete the files, but i'm getting an error that
            #   I don't understand.
            #self.wavfile.delete(save=False)
            
            #   So instead, lets just delete the file manually.
            os.unlink(self.wavfile.name)

            
        # Remove oggfile
        if(self.oggfile and os.path.exists(self.oggfile.name)):
            #self.oggfile.delete(save=False)
            os.unlink(self.oggfile.name)
        
        # Remove mp3file
        if(self.mp3file and os.path.exists(self.mp3file.name)):
            #self.mp3file.delete(save=False)
            os.unlink(self.mp3file.name)

        # Remove viewer
        if(self.waveformViewer and os.path.exists(self.waveformViewer.name)):
            #self.waveformViewer.delete(save=False)
            os.unlink(self.waveformViewer.name)

        # Remove editor image
        if(self.waveformEditor and os.path.exists(self.waveformEditor.name)):
            #self.waveformEditor.delete(save=False)
            os.unlink(self.waveformEditor.name)

        # Get all segments who have this audio object as its parent
        segments = AudioSegment.objects.filter(audio = self)

        # Delete all of the segments
        for segment in segments:
            segment.delete()

        for event in AudioUploadedEvent.objects.filter(audio=self):
            event.active = False

        # Send delete up if necessary.  This will not happen if the audio object
        #   has not called save()
        if(self.id):
            super(Audio, self).delete()

    ##
    # Generate all the waveforms for this audio object.  
    #   TODO: transition these audioFormats calls to the new audio library.
    #
    def generate_waveform(self):
        wavPath = os.path.join(MEDIA_ROOT, self.wavfile.name)
        wavName = os.path.split(wavPath)[-1]
        # Create the wav object
        wavObj = audioFormats.Wav(wavPath)
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
