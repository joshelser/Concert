#!/usr/bin/env python

import os.path

class audio:
    ## Constructor
    def __init__():
        pass

class wav(audio):
    ##
    # Constructor.
    # 
    # @param inputFileName The name of a WAV file
    # 
    def __init__(self, inputFileName):
        # Make sure file exists
        if not os.path.isfile(inputFileName):
            raise IOError
        
        ##  @public fileName  
        self.fileName = inputFileName


    ## 
    # Crops a WAV file to the given seconds
    #
    # @param outputFileName The name of the WAV file to write the cropped data to
    # @param begin The time, in seconds, to begin
    # @param end The time, in seconds, to end
    #
    #  Extra details
    def crop (self, outputFileName, begin, end):
        import wave
        import sys
    
        # Amount of data to read at a time
        chunk = 1024
    
        # Open a wave filehandle
        src = wave.open(self.fileName, 'rb')
    
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
