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


###
#   partial for create_join_collection panel on the settings page.
@register.inclusion_tag('collections/partials/create_join_collection_panel.html')
def create_join_collection_panel(title, id):
    return panel(title, id)

###
#   partial for manage_collections panel on the settings page.
@register.inclusion_tag('collections/partials/manage_collections_panel.html')
def manage_collections_panel(title, id):
    return panel(title, id)

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
    

