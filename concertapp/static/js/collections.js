/**
 *  @file       collections.js
 *  All functionality associated with collections page.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
function initializeCollectionsPage() {
    
    
    initializeCreateJoinAutocompleteBehavior();
    
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
    $('#create_new_collection').live('click', function(event) {
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
                }
            }
        });
    });
    
    
}