from concertapp.models import *

user = User.objects.get(pk=1)
audio = Audio.objects.get(pk=1)

audio.segment("Seg1",5,30,user)
 
