from concertapp.models import Audio
#from django import forms
from django.forms import ModelForm


##
# The form uploads an audio file to the system
##
class UploadFileForm(ModelForm):
    class Meta:
        model = Audio
        fields = ('wavfile', )
        #exclude = ('user', 'waveform', 'filename', 'oggfile')

    ##
    # Ensures that the wavfile has a valid extension
    #
    # @param    self    The UploadFileForm object
    ##
    def clean_wavFile(self):
        # Get the content-type of the file
        filetype = self.cleaned_data['wavfile'].content_type

         # Ensure the file is wav, ogg, or mp3
        if filetype != 'audio/x-wav' and \
                filetype != 'audio/mpeg' and \
                filetype != 'application/ogg':
            raise forms.ValidationError('Audio file must be wav, mp3, or ogg')

        # Always return the data from the clean_* function
        return self.cleaned_data['wavfile']