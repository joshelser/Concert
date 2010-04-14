from django.forms import ModelForm
from django import forms
#from django.core import validators

from concertapp.models import User, Audio, UserGroup

class CreateGroupForm(ModelForm):
    class Meta:
        model = UserGroup
        exclude = ('admin')
 
class RegistrationForm(ModelForm):
    username = forms.CharField(label='username',
                        max_length=30,
                        required=True)
    email = forms.EmailField(label='email',
                         max_length=30,
                         required=True)
    password1 = forms.CharField(label='password1',
                            max_length=60,
                            required=True,
                            widget=forms.PasswordInput(render_value=False))
    password2 = forms.CharField(label='password2',
                            max_length=60,
                            required=True,
                            widget=forms.PasswordInput(render_value=False))
    class Meta:
        model = User
        exclude = ('username', 'first_name', 'last_name', 'email', 'password', 'is_staff', 'is_active', 'is_superuser', 'last_login', 'date_joined', 'groups', 'user_permissions')

    #def isValidUsername(self, field_data, all_data):
    #    try:
    #        User.objects.get(username=field_data)
    #    except User.DoesNotExist:
    #        return
    #    raise validators.ValidationError('The username "%s" is already taken.' % field_data)

class UploadFileForm(ModelForm):
    wavfile = forms.FileField(label='Audio File')
    class Meta:
        model = Audio
        exclude = ('user', 'waveform', 'filename')

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
