#! /usr/bin/python

import sys
import audiotools

BUFFER_SIZE = 1024

inTime = 30
outTime = 50

duration = outTime-inTime
wav = audiotools.open('out4410016bit.wav').to_pcm()
sampleRate = wav.sample_rate

startSample = inTime*sampleRate
amountOfSamples = duration*sampleRate
parts = audiotools.pcm_split(wav, [startSample, amountOfSamples])

# First part is before section of interest
part = parts.next()
# Second part is what we need
part = parts.next()
# output to file
audiotools.WaveAudio.from_pcm('segment.wav', part)
