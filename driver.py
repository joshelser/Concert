#! /usr/bin/env python

from audio import *

wavObj = wav("file.wav")
wavObj.crop("out.wav", 5, 10)
