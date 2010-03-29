from django.forms import ModelForm
from django import forms

from concertapp.concert.models import Blogpost, User

class BlogpostForm(ModelForm):
    class Meta:
        model = Blogpost
        exclude = ('author',)

class RegistrationForm(ModelForm):
    passwd = forms.CharField(label='Password', widget=forms.PasswordInput(render_value=False))
    class Meta:
        model = User
