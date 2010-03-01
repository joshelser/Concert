#! /usr/bin/env python

from audioFormats import *

# Create generic audio object 
obj = audio("html5audio/media/Oddity.wav")

# Create WAV object
wavObj = wav(obj)
length = wavObj.getLength()
wavObj.generateWaveform('Oddity.png', 4 * length, 585, 2048, 22050, 10)
wavObj.crop("out.wav", 126, 232)

# Create MP3 object
mp3Obj = mp3(obj)
mp3Obj.mp3Encode("out.mp3", 192)

# Create ogg object
oggObj = ogg(obj)
oggObj.oggEncode("out.ogg")
