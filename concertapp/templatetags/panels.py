from django import template
from django.template.loader import render_to_string

register = template.Library()


def get_panel(parser, token):
    try:
        tag_name, template_location, id, title = token.split_contents()
    except ValueError:
        raise template.TemplateSyntaxError, "%r tag requires a two arguments" % token.contents.split()[0]
    
    def is_quoted(a_string):
        if (a_string[0] == a_string[-1] and a_string[0] in ('"', "'")):
            return True
        return False

    if not is_quoted(template_location):
        raise template.TemplateSyntaxError, "%r tag's 1st argument should be in quotes" % tag_name
    if not is_quoted(id): 
        raise template.TemplateSyntaxError, "%r tag's 2nd argument should be in quotes" % tag_name
    if not is_quoted(title):
        raise template.TemplateSyntaxError, "%r tag's 3rd argument should be in quotes" % tag_name

    return PanelNode(template_location[1:-1], id[1:-1], title[1:-1])

class PanelNode(template.Node):
    def __init__(self, template_location, id, title):
        self.template_location = template_location
        self.id = id
        self.title = title
    def render(self, context):
        return render_to_string(self.template_location, {'id': self.id, 'title':self.title}, context)

register.tag('panel2', get_panel)





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
@register.inclusion_tag('organize/partials/audiolist_panel.html')
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
#   partial for social panel on the settings page.
@register.inclusion_tag('collections/partials/social_panel.html')
def social_panel(title, id):
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

###
#   partial for upload_audio_panel
@register.inclusion_tag('audio/partials/upload_audio_panel.html')
def upload_audio_panel(title, id):
    return panel(title, id)


###
#   partial for concert_info_panel
@register.inclusion_tag('dashboard/partials/concert_info.html')
def concert_info_panel(title, id):
    return panel(title, id)


###
#   partial for concert_info_panel
@register.inclusion_tag('dashboard/partials/recent_events.html')
def recent_events_panel(title, id, user):
    dataForTemplate = panel(title, id)
    dataForTemplate['user'] = user
    
    return dataForTemplate


