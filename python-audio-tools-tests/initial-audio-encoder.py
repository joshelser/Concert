#! /usr/bin/python

import sys
import audiotools

BUFFER_SIZE = 1024

###
# Convert input file to .wav, .ogg, .mp3 (use for initial import)
###
# open file
print 'opening file'
try:
  orig = audiotools.open('input4800016bit.wav')
except audiotools.UnsupportedFile, e:
  print 'ERROR: '+str(e)
except IOError, e:
  print 'ERROR: '+str(e)


print 'decoding file to pcm'
try:
  origPCM = orig.to_pcm()
except audiotools.PCMReaderError, e:
  print 'ERROR: '+str(e)

# By default, make the channel mask stereo if the mask is invalid.
channel_mask = origPCM.channel_mask
print 'original file channel_mask: '+str(channel_mask)
if channel_mask < 2 or channel_mask > 3:
  raise Exception ('Unsupported audio channel configuration')

# Make sure bit depth is not > 16
bits_per_sample = origPCM.bits_per_sample
print 'original file bit depth: '+str(bits_per_sample)
if bits_per_sample > 16:
  raise Exception ('Unsupported bit-depth')
  
# Make sure sample rate is not > 44100
sample_rate = origPCM.sample_rate
print 'original sample rate: '+str(sample_rate)
if sample_rate > 44100:
  sample_rate = 44100

  
print 'normalizing PCM'
# Create new PCM stream at 44100, with 2 channels, for each output destination
normalizedPCM = audiotools.PCMConverter(origPCM, 44100, 2, channel_mask, bits_per_sample)


print 'new sample rate: '+str(normalizedPCM.sample_rate)
print 'new bit depth: '+str(normalizedPCM.bits_per_sample)
print 'new channel mask: '+str(normalizedPCM.channel_mask)


outputFileName = 'out4410016bit'
print 'outputting to wav'
# Output normalized audio to wav
try:
  wav = audiotools.WaveAudio.from_pcm(outputFileName+'.wav', normalizedPCM)
except audiotools.EncodingError, e:
  print 'ERROR: '+str(e)
  

### Now open wav we just created, and save it as mp3 and ogg
print 'output to mp3'
try:
  mp3 = audiotools.MP3Audio.from_pcm(outputFileName+'.mp3', audiotools.open(outputFileName+'.wav').to_pcm())
except audiotools.EncodingError, e:
  print 'ERROR: '+str(e)

print 'output to ogg'
try:
  ogg = audiotools.VorbisAudio.from_pcm(outputFileName+'.ogg', audiotools.open(outputFileName+'.wav').to_pcm())
except audiotools.EncodingError, e:
  print 'ERROR: '+str(e)

print 'Exiting...'

