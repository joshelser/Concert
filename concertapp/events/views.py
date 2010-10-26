from concertapp.models import event
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import *
from django.shortcuts import render_to_response
from django.http import HttpResonse


def events(request):
    

    events = Event.objects.all()

    return HttpResonse(events)
    
    
