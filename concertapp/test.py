from concertapp.models import *

user = User.objects.get(pk=1)
Collection.objects.all().delete()

collection = Collection(admin = user, name = "Collection 1")
collection.save()

try:
    user = User.objects.get(username = "adam")
    user.delete()
except User.DoesNotExist:
    pass

user = User(username = "adam")
user.save()
user.get_profile().collection_join_requests.add(collection)
collection.add_user(user)

#user = User(username = "bob")
#user.save()
#collection.add_user(user)
