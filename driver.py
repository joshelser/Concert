#! /usr/bin/env python

from audio import *

wavObj = wav("html5audio/media/Oddity.wav")
length = wavObj.getLength("html5audio/media/Oddity.wav")
wavObj.generateWaveform('html5audio/media/Oddity.wav', 'Oddity.png', 4 * length, 585, 2048, 22050, 10)


wavObj.crop("out.wav", 126, 232)

mp3Obj = mp3()
mp3Obj.encode("out.wav", "out.mp3")

oggObj = ogg()
oggObj.encode("out.wav", "out.ogg")
