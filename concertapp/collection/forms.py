from concertapp.models import Audio, Collection
from django import forms
from django.forms import ModelForm

##
#   A form used to validate the name of a new collection
##
class CreateCollectionForm(ModelForm):
    # This form is bound to a collection object
    class Meta:
        model = Collection
        # We don't need to validate the group admin
        exclude = ('admin')

    ##
    #   Makes sure a duplicate name doesn't exist
    #
#    def clean_collection_name(self):
#        cname = self.cleaned_data['collection_name']
#        
#        collectionsWithSameName = Collection.objects.filter(name = cname)
#
#        if len(collectionsWithSameName) > 0:
#            raise forms.ValidationError('That name is already taken')
#
#        return cname
