/**
 *  @file       collections.js
 *  All functionality associated with collections page.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
function initializeCollectionsPage(params) {
    
    
    /**
     *  Create "create/join collection panel"
     **/
    var createJoinCollectionPanel = new CreateJoinCollectionPanel({
        container: $('#create_join_container'), 
        createJoinInputElement: $('#create_join_input'), 
        createJoinResultsElement: $('#create_join_results'),
        createJoinResultTemplate: $('#create_join_result'),
        createJoinCreateNewTemplate: $('#create_join_create_new')
    });
    
    
    initializeDeleteCollectionButtonBehavior(params);
    
    updateManageCollectionsList(params);
    
}


function updateManageCollectionsList(params) {
    
    var container = $('#manage_collections_container');
    var userCollectionTemplate = $('#user_collection');
    var userCollectionDeleteTemplate = $('#user_collection_delete');
    var userCollectionLeaveTemplate = $('#user_collection_leave');
    
    /* Retrieve JSON data for manage collections list */
    $.getJSON('user/', function(container, userCollectionTemplate, userCollectionDeleteTemplate, userCollectionLeaveTemplate, globalOptionsPanel) {
        return function(data, status) {
        
            /* Temporary fragment for all DOM additions */
            var frag = document.createDocumentFragment();
        
            for(i = 0, il = data.length; i < il; i++) {
                var col = data[i];
                
                frag.appendChild(
                    userCollectionTemplate.tmpl({
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
            globalOptionsPanel.updateCollectionSelector(data);
            
        };
    }(container, userCollectionTemplate, userCollectionDeleteTemplate, userCollectionLeaveTemplate, params.globalOptionsPanel));
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
