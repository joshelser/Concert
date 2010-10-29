from concertapp.models import Audio
#from django import forms
from django.forms import ModelForm


##
# The form uploads an audio file to the system
##
class UploadFileForm(ModelForm):
    class Meta:
        model = Audio
        fields = ('wavfile')
