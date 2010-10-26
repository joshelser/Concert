/**
 *  @file       collections.js
 *  All functionality associated with collections page.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
function initializeCollectionsPage() {
    
    
    initializeCreateJoinAutocompleteBehavior();
    
    initializeDeleteCollectionButtonBehavior();
    
    updateManageCollectionsList();
    
}


function updateManageCollectionsList() {
    
    var container = $('#manage_collections_container');
    var userCollectionTemplate = $('#user_collection');
    var userCollectionDeleteTemplate = $('#user_collection_delete');
    var userCollectionLeaveTemplate = $('#user_collection_leave');
    
    /* Retrieve JSON data for manage collections list */
    $.getJSON('user/', function(container, userCollectionTemplate, userCollectionDeleteTemplate, userCollectionLeaveTemplate) {
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
            
            container.empty().append(frag);
        };
    }(container, userCollectionTemplate, userCollectionDeleteTemplate, userCollectionLeaveTemplate));
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


/**
 *  Completely encapsulates all functionality associated with the "create/join"
 *  box.  Should make this re-usable code next time we need to do something similar.
 **/
function initializeCreateJoinAutocompleteBehavior() {
    
    var resultsContainer = $('#create_join_results');
    var createNewTemplate = $('#create_new_result');
    var resultTemplate = $('#create_join_result');
    
    /* This function is called when auto complete runs, and data is retrieved */
    var autoCompleteResponse = function(resultsContainer, createNewTemplate, resultTemplate) {
        return function(data, term) {
            /* results were found! */
            if(data.length) {
                /* Temporary structure for results */
                var frag = document.createDocumentFragment();

                /* For each result */
                for(i = 0, il = data.length; i < il; i++) {
                    var obj = data[i].fields
                    /* Add to fragment */
                    frag.appendChild(resultTemplate.tmpl({
                        name: obj.name, 
                        id: obj.pk
                    }).get(0));
                }
                /* empty results container */
                resultsContainer.empty();
                /* Put results in container */
                resultsContainer.append(frag);
            }
            /* No results :( */
            else if(term != '') {
                /* results container will just be "create new" option */
                resultsContainer.html(createNewTemplate.tmpl({
                    query: term, 
                }));
            }
            /* No search term */
            else {
                resultsContainer.empty();
            }
        };
    }(resultsContainer, createNewTemplate, resultTemplate);
    
    
    /* The actual jQuery UI autocomplete call */
    $('#create_join_input').autocomplete({
        minLength: 0,
        source: function(resultsContainer, myResponse) {
            
            return function(request, response) {
                /* Our search term */
                var term = request.term;
                
                /* If there is something to search for */
                if(term && term != '') {
                    
                    /* Search for it */
                    com.concertsoundorganizer.ajax.lastCreateJoinXhr = $.getJSON(
                        'search/'+term, 
                        {}, 
                        function(data, status, xhr) {
                            if(xhr === com.concertsoundorganizer.ajax.lastCreateJoinXhr) {
                                myResponse(data, term);                         
                            }
                        }
                    );
                    
                }
                /* Search is empty */
                else {
                    myResponse([], term);
                }
            };

        }(resultsContainer, autoCompleteResponse),
        
        open: function(event, ui) {
        },
        
        change: function(event, ui) {
        },
        
        search: function(event, ui) {
        }
    })
    .data('autocomplete')._renderItem = function(resultsContainer) {
        return function(ul, item) {
            if(item.value == 'null' && item.label == 'null') {
                var createNewResult = 'Create group "'+$('create_join_input').val()+'"';
                resultsContainer.append(createNewResult);
            }
        }
    }(resultsContainer);
    
    /* When 'create collection' button is pressed */
    $('#create_new_collection').live('click', function(resultsContainer) {
        return function(event) {
            var collection_name = $(this).attr('data-collection_name');
            $.ajax({
                type: 'POST',
                url: 'add/',
                data: { name: collection_name },
                success: function(data, status, xhr) {
                    if(data == 'success') {
                        com.concertsoundorganizer.notifier.alert({
                            'title': 'Success!', 
                            'content': 'Your collection was created succesfully.'
                        });
                        
                        /* Update collection table */
                        updateManageCollectionsList();
                        
                    }
                    else {
                        com.concertsoundorganizer.notifier.alert({
                            'title': 'Error',
                            'content': 'Your collection was not created.'
                        });
                        
                        resultsContainer.empty();
                    }
                }
            });
        };
    }(resultsContainer));
}