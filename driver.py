#! /usr/bin/env python

from audio import *

wavObj = wav("eveningsun.wav")
wavObj.crop("out.wav", 126, 232)

mp3Obj = mp3()
mp3Obj.encode("out.wav", "out.mp3")
