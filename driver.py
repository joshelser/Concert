#! /usr/bin/env python

from audioFormats import *

# Create ogg object
oggObj = Ogg('web/media/Oddity.wav')
oggObj.oggEncode("out.ogg")

# Create generic audio object 
obj = Audio('web/media/Oddity.wav')

# Create WAV object
wavObj = Wav('web/media/Oddity.wav')
length = wavObj.getLength()
wavObj.generateWaveform('Oddity_'+str(5 * length)+'.png', 5 * length, 585)
wavObj.crop("out.wav", 126, 232)

# Create MP3 object
mp3Obj = Mp3('web/media/Oddity.wav')
mp3Obj.mp3Encode("out.mp3", 192)

