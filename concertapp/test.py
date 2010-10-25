from concertapp.models import *

user = User.objects.get(pk=1)

try:
    group = Group.objects.get(pk=1)
except Group.DoesNotExist:
    group = Group(name = "georga5")
    user.groups.add(group)
    user.save()

try:
    tag = Tag.objects.get(pk=1)
except Tag.DoesNotExist:
    tag = Tag(group = group, name = "TAG1")
    tag.save()

TagComment.objects.all().delete()
for i in range(1,10):
    tag_comment = TagComment(user=user, comment=str(i), tag=tag)
    tag_comment.save()
