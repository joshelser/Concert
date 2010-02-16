#!/usr/bin/env python

import wave
import sys

# Vars
chunk = 1024
INDEX = 65
RECORD_SECONDS = INDEX + 15
OUTPUT_FILENAME = "test.wav"

# Input source filename
if len(sys.argv) < 2:
    print "Crops a wave file.\n\n" +\
          "Usage: %s filename.wav" % sys.argv[0]
    sys.exit(-1)

# Open a wave filehandle
src = wave.open(sys.argv[1], 'rb')

# Wav file info
CHANNELS = src.getnchannels()
FORMAT = src.getsampwidth()
RATE = src.getframerate()

# Store the data in here
all = []

# Jump through the beginning
src.setpos((RATE/chunk) * INDEX * chunk)

# read data
for i in range(RATE / chunk * INDEX, RATE / chunk * RECORD_SECONDS):
    data = src.readframes(chunk)
    all.append(data)

# Close the source wav file
src.close()

# Join all of the data together
data = ''.join(all)

# Open the destination wav file
wf = wave.open(OUTPUT_FILENAME, 'wb')

# Set all of the format data
wf.setnchannels(CHANNELS)
wf.setsampwidth(FORMAT)
wf.setframerate(RATE)

# Write the data
wf.writeframes(data)

# Close the buffer
wf.close()


