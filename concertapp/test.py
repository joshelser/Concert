from concertapp.models import *

user = User.objects.get(pk=1)
Collection.objects.all().delete()

collection = Collection(admin = user, name = "Collection 1")
collection.save()

user = User.objects.get(username = "john")

collection.add_request_to_join(user)
collection.add_user(user)
