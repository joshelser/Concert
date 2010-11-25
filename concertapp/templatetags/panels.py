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
#   This is a partial for a panel that displays on the left of the screen
@register.inclusion_tag('partials/left_panel.html')
def left_panel(title, id):
    return {
        'title': title, 
        'id': id, 
    }
    
###
#   This is a partial for a right side panel
@register.inclusion_tag('partials/right_panel.html')
def right_panel(title, id):
    return {
        'title': title, 
        'id': id, 
    }

###
#   This is a partial for a bottom panel
@register.inclusion_tag('partials/bottom_panel.html')
def bottom_panel(title, id):
    return {
        'title': title, 
        'id': id, 
    }



###
#   This is a partial template for the audiolist panel.  No extra functionality 
#   is needed in this partial controller, so we just pass args along to the parent 
#   template partial controller.
@register.inclusion_tag('organize/partials/audiolist_panel.html')
def audiolist_panel(title, id):
    return panel(title, id)


###
#   partial for create_join_collection panel on the settings page.
@register.inclusion_tag('collections/partials/create_join_collection_panel.html')
def create_join_collection_panel(title, id):
    return left_panel(title, id)

###
#   partial for manage_collections panel on the settings page.
@register.inclusion_tag('collections/partials/manage_collections_panel.html')
def manage_collections_panel(title, id):
    return bottom_panel(title, id)

###
#   partial for social panel on the settings page.
@register.inclusion_tag('collections/partials/social_panel.html')
def social_panel(title, id):
    return right_panel(title, id)

###
#   partial for social panel on the settings page.
@register.inclusion_tag('collections/partials/social_panel.html')
def social_panel(title, id):
    return right_panel(title, id)


###
#   partial for global options panel on every page
#
#   @param  page_name        String - the name of the current page to display to 
#                               user
#   
@register.inclusion_tag('partials/global_options_panel.html')
def global_options_panel(title, id, page_name, user):
    dataForTemplate = panel(title, id)
    dataForTemplate['page_name'] = page_name
    dataForTemplate['user'] = user
    
    return dataForTemplate

###
#   partial for upload_audio_panel
@register.inclusion_tag('audio/partials/upload_audio_panel.html')
def upload_audio_panel(title, id):
    return panel(title, id)

