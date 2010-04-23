from django.forms import ModelForm
from django import forms
from django.contrib.auth.models import Group, User
#from django.core import validators

from concertapp.models import Audio, GroupAdmin, Tag, AudioSegment

class CreateGroupForm(ModelForm):
    group_name = forms.CharField(label="group_name", max_length=80,
            required=True)

    class Meta:
        model = GroupAdmin
        exclude = ('admin', 'group')
 
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
        exclude = ('username', 'first_name', 'last_name', 'email', 'password',
             'is_staff', 'is_active', 'is_superuser', 'last_login', 
             'date_joined', 'groups', 'user_permissions')

    def clean_username(self):
        username = self.cleaned_data['username']
        try:
            User.objects.get(username=username)
        except User.DoesNotExist:
            try:
                Group.objects.get(name = username)
            except Group.DoesNotExist:
                return username

        raise forms.ValidationError('The username "%s" is already taken.' %
                username)

class UploadFileForm(ModelForm):
    wavfile = forms.FileField(label='Audio File')
    class Meta:
        model = Audio
        fields = ('wavfile', )
        #exclude = ('user', 'waveform', 'filename', 'oggfile')

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

class CreateSegmentForm(ModelForm):
    tag_field = forms.CharField(label='Tag', max_length=80)
    label_field = forms.CharField(label='Label', max_length=80)
    group_id = forms.HiddenInput()
    audio_id = forms.HiddenInput()

    class Meta:
        model = AudioSegment
        fields = ['label_field', 'tag_field', 'beginning', 'end', ]

    def clean_beginning(self):
        # Ensure valid numeric data
        try:
            val = float(self.cleaned_data['beginning'])
        except ValueError:
            raise forms.ValidationError('Must be a number')

        # Valid start time
        if val < 0.0:
            raise forms.ValidationError('Must be greater than zero')

        return self.cleaned_data['beginning']

    def clean_end(self):
        try:
            val = float(self.cleaned_data['end'])
        except ValueError:
            raise forms.ValidationError('Must be a number')

        if val <= float(self.cleaned_data['beginning']):
            raise forms.ValidationError('Must be larger than beginning value')

        return self.cleaned_data['end']
        

    
class RenameSegmentForm(ModelForm):
    label_field = forms.CharField(label='Label', max_length=80)
    id_field = forms.HiddenInput()
    
    
    class Meta:
        model = AudioSegment
        fields = ['label_field']
    
    
    
    
    
    
    
    
    
