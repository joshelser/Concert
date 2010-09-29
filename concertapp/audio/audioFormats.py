#!/usr/bin/env python

## @package audioFormats

import os
import subprocess
from chunk import *
import wave

from waveform import *

## Environment variable for subprocesses
environ = {'PATH': str(os.getenv('PATH'))}

## A tuple containing known audio file formats
fileTypes = ('wav', 'ogg', 'mp3')

## Audio Class
# @class audio
#
# @public filePath The full path to a file
# @public fileName The actual name of the file
# @public fileType The type of the audio file
class Audio(object):
    ## Constructor
    #
    # @param self Class Object
    # @param inputFileName The path of an audio file
    #
    def __init__(self, inputFileName):
        # Make sure file exists
        if not os.path.isfile(inputFileName):
            raise IOError('Could not open the audio file: "%s"' % inputFileName)
        
        self.filePath = inputFileName

        self.fileName = os.path.basename(inputFileName)

        self.fileType = os.path.splitext(self.fileName)[1].lower()[1:]

        # Ensure a file was uploaded in a known audio file format
        #if not self.fileType in fileTypes:
        #    raise NameError('Unknown audio file format')

## WAV class
# @class wav
#
# @extends audio
class Wav(Audio):
    ## Constructor
    #
    # @param self wav object
    #
    def __init__(self, inputFileName):
        super(Wav, self).__init__(inputFileName)

    ## Gets the length, in seconds, of a wave file
    #
    # @param self Class object
    #
    # @return Number of seconds
    def getLength(self):
        waveFile = wave.open(self.filePath, 'r')
        length = waveFile.getnframes() / waveFile.getframerate()
        waveFile.close()

        return length

    ## Decodes a WAV file
    #
    # @param self
    # @param outputFileName
    #
    def wavDecode(self, outputFileName):
        pass

    ## Encodes a file as WAV
    #
    # @param self
    # @param outputFileName
    #
    def wavEncode(self, outputFileName):
        pass

    ## Crops a WAV file to the given seconds
    #
    # @param outputFileName The name of the WAV file to write the cropped data to
    # @param begin The time, in seconds, to begin
    # @param end The time, in seconds, to end
    #
    #  Extra details
    def crop(self, outputFileName, begin, end):
        # Check the begin time
        if begin < 0:
            raise ValueError('Begin must be greater than or equal to zero')

        # Check the end time
        if end > self.getLength():
            raise ValueError('End must be less than or equal to the length')

        import wave
        import sys
    
        # Amount of data to read at a time
        chunk = 1024
    
        # Open a wave filehandle
        src = wave.open(self.filePath, 'rb')
    
        # Wav file info
        channels = src.getnchannels()
        format = src.getsampwidth()
        rate = src.getframerate()

        # Store the data in here
        all = []

        # Jump through the beginning
        src.setpos(rate * begin)

        # read data
        for i in range(rate / chunk * begin, rate / chunk * end):
            data = src.readframes(chunk)
            all.append(data)

        # Close the source wav file
        src.close()

        # Join all of the data together
        data = ''.join(all)
    
        # Open the destination wav file
        wf = wave.open(outputFileName, 'wb')
    
        # Set all of the format data
        wf.setnchannels(channels)
        wf.setsampwidth(format)
        wf.setframerate(rate)
    
        # Write the data
        wf.writeframes(data)

        # Close the buffer
        wf.close()

    ## Generates the waveform image from a WAV file
    #
    # @param self Wav object
    # @param imageName The name of the file to write to
    # @param imageWidth Width of image in pixels
    # @param imageHeight Height of image in pixels
    # @param channels The number of channels to generate images for. 0 chooses all channels
    # @param fft_size Optional
    # @param f_max Optional 
    # @param f_min Optional
    #
    def generateWaveform(self, imageName, imageWidth, imageHeight, channels=0, fft_size=2048, f_max=22050, f_min=10):
        # Determine channels if unknown
        if channels == 0:
            src = wave.open(self.filePath, 'rb')
            channels = src.getnchannels()
            src.close()

        create_png(self.filePath, imageName, imageWidth, imageHeight, channels, fft_size, f_max, f_min);


    ## Encode audio into OGG
    #
    # @param self
    # @param outputFileName
    # @param quality
    #
    # @return A subprocess object
    def oggEncode(self, outputFileName, quality=192):
        command = "oggenc -b %i '%s' -o '%s'" % (quality, self.filePath, outputFileName)

        sub = subprocess.Popen(command, shell=True, env=environ, stderr=subprocess.PIPE, stdout=subprocess.PIPE, stdin=subprocess.PIPE)

        return sub


    ## Encode audio into MP3
    #
    # @param self
    # @param outputFileName
    # @param quality
    #
    # @return A subprocess object
    def mp3Encode(self, outputFileName, quality=192):
        command = "lame --quiet -m auto --preset cbr %i '%s' '%s'" % (quality, self.filePath, outputFileName)

        sub = subprocess.Popen(command, shell=True, env=environ, stderr=subprocess.PIPE, stdout=subprocess.PIPE, stdin=subprocess.PIPE)
        return sub

## MP3
# @class mp3
# 
# @extends audio
class Mp3(Audio):
    ## Constructor
    #
    # @param self wav object
    #
    def __init__(self, inputFileName):
        super(Mp3, self).__init__(inputFileName)

    ## Decode an MP3 file
    #
    # @param self
    # @param outputFileName
    #
    # @return A subprocess object
    def mp3Decode(self, outputFileName):
        command = "lame --quiet --decode --mp3input '%s' '%s'" % (self.filePath, outputFileName)

        sub = subprocess.Popen(command, shell=True, env=environ, stderr=subprocess.PIPE, stdout=subprocess.PIPE, stdin=subprocess.PIPE)
        return sub


## Ogg
# @class ogg
#
# @extends audio
class Ogg(Audio):
    ## Constructor
    #
    # @param self wav object
    #
    def __init__(self, inputFileName):
        super(Ogg, self).__init__(inputFileName)

    ## Decode an OGG file
    #
    # @param self
    # @param outputFileName
    #
    # @return A subprocess object
    def oggDecode(self, outputFileName):
        command = "oggdec '%s' -o '%s' -Q" % (self.filePath, outputFileName)

        sub = subprocess.Popen(command, shell=True, env=environ, stderr=subprocess.PIPE, stdout=subprocess.PIPE, stdin=subprocess.PIPE)

        return sub

