/**
 *  @file       ManageCollectionsPanel.js
 *  Panel that lists collections for the user to manage.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

function ManageCollectionsPanel(params) {
    if(params) {
        this.init(params);
    }
}
ManageCollectionsPanel.prototype = new Panel();

/**
 *  @param  params.collectionTemplate        jQuery tmpl - for the collection row.  
 **/
ManageCollectionsPanel.prototype.init = function(params) {
    Panel.prototype.init.call(this, params);

    /* Template for each collection in the list */
    var collectionTemplate = params.collectionTemplate;
    if(typeof(collectionTemplate) == 'undefined') {
        throw new Error('params.collectionTemplate is undefined');
    }
    this.collectionTemplate = collectionTemplate;
    
    
    /* reference to globalOptionsPanel so we can call methods on there */
    this.globalOptionsPanel = null;    
    
}

/**
 *  Retrieves collections from backend, then updates the list.
 **/
ManageCollectionsPanel.prototype.retrieveAndUpdateCollections = function() {
    /* Retrieve JSON data for manage collections list */
    $.getJSON('user/', function(me) {
        return function(data, status) {
            me.updateCollections(data);
        };
    }(this));
}

/**
 *  Updates the collection list.
 **/
ManageCollectionsPanel.prototype.updateCollections = function(data) {
    
    var collectionTemplate = this.collectionTemplate;
    var container = this.container;
    
    /* Temporary fragment for all DOM additions */
    var frag = document.createDocumentFragment();

    for(i = 0, il = data.length; i < il; i++) {
        var col = data[i];
        
        frag.appendChild(
            collectionTemplate.tmpl({
                id: col.id, 
                name: col.name, 
                num_users: col.num_users,
                admin: col.admin 
            }).get(0)
        );
    
    }
    
    /* Update manage collections list */
    container.empty().append(frag);
    
    /* Update dropdown */
    this.globalOptionsPanel.updateCollectionSelector(data);
}



/**
 *  The behavior for all "delete collection" buttons.  These buttons will
 *  only appear if you are an admin, and any attempt to send a request will
 *  result in failure if you are not an admin.
 **/
function initializeDeleteCollectionButtonBehavior() {
    $('button.delete_collection').live('click', function() {
        var collection_id = $(this).attr('data-collection_id');
        
        /* Confirm with user */
        com.concertsoundorganizer.notifier.confirm({
            'title': 'Are you sure?',
            'content': 'Are you sure you want to delete this collection?<br />All related content will be removed from Concert.',
            'confirmCallback': function(collection_id) {
                return function() {
                    deleteCollection(collection_id);
                };
            }(collection_id)/*,
            'cancelCallback': function(collection_id) {
                return function() {

                };
            }(collection_id)*/
        });
        
    });
}

function deleteCollection(col_id) {
    /* we are serious about deleting this collection. */
    $.ajax({
        url: 'delete/',
        data: { id: col_id },
        type: 'POST',
        success: function(col_id) {
            return function(data, status, xhr) {
                if(data == 'success') {
                    com.concertsoundorganizer.notifier.alert({
                        title: 'Success!',
                        content: 'The collection has been deleted.'
                    });
                
                    /* Remove from "manage collections" table */
                    $('#user_collection-'+col_id).remove();
                    
                }
                else {
                    com.concertsoundorganizer.notifier.alert({
                        title: 'Error', 
                        content: 'An error has occurred.'
                    });
                }
            };
        }(col_id)
    });
}
