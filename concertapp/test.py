from concertapp.models import *

user = User.objects.get(pk=1)
audio = Audio.objects.get(pk=1)

audio.segment_and_tag("Seg1",5,30,"Tag1",user)
 
