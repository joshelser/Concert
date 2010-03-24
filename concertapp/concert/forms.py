from django.forms import ModelForm

from concertapp.concert.models import Blogpost

class BlogpostForm(ModelForm):
    class Meta:
        model = Blogpost
        exclude = ('author',)
