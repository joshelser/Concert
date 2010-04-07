from django.forms import ModelForm
from django import forms

from concertapp.concert.models import Blogpost, User, Audio

class BlogpostForm(ModelForm):
    class Meta:
        model = Blogpost
        exclude = ('author',)

class RegistrationForm(ModelForm):
    passwd = forms.CharField(label='Password', widget=forms.PasswordInput(render_value=False))
    class Meta:
        model = User

class UploadFileForm(ModelForm):
    wavFile = forms.FileField(label='Audio File')
    class Meta:
        model = Audio
        exclude = ('user', 'waveform')

    def clean_wavFile(self):
        # Get the content-type of the file
        filetype = self.cleaned_data['wavFile'].content_type

        # Ensure the file is wav, ogg, or mp3
        if filetype != 'audio/x-wav' and \
                filetype != 'audio/mpeg' and \
                filetype != 'application/ogg':
            raise forms.ValidationError('Audio file must be wav, mp3, or ogg')

        # Always return the data from the clean_* function
        return self.cleaned_data['wavFile']
