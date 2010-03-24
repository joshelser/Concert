from django.forms import ModelForm

from concertapp.concert.models import Blogpost, User

class BlogpostForm(ModelForm):
    class Meta:
        model = Blogpost
        exclude = ('author',)

class UserForm(ModelForm):
    class Meta:
        model = User

