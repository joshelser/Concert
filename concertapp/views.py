from django.contrib.auth.models import *
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response, get_object_or_404
import tempfile, os

## Experimental stuff ##
def comments(request):
    comments = Comment.objects.all()
    
    return render_to_response("comments_experiment.html",{
            "comments": comments,
            })

def users(request):
    comments = User.objects.all()

    return render_to_response("comments_experiment.html",{
            "comments": comments,
            })
