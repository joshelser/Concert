from django import template

register = template.Library()

###
#   This is a partial template for a panel.  All panels will have this same stuff.
#
#   @param  title        String  -  the title of this panel which will be displayed
#                           in the panel header.
#   @param  id          String - the id of the panel for id and class attributes
@register.inclusion_tag('partials/panel.html')
def panel(title, id):
    return {
        'title': title, 
        'id': id, 
    }

###
#   This is a partial template for the audiolist panel.  No extra functionality 
#   is needed in this partial controller, so we just pass args along to the parent 
#   template partial controller.
@register.inclusion_tag('partials/audiolist_panel.html')
def audiolist_panel(title, id):
    return panel(title, id)
