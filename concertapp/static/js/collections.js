/**
 *  @file       collections.js
 *  All functionality associated with collections page.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
function initializeCollectionsPage() {
    
    
    initializeCreateJoinAutocompleteBehavior();
    
}

function initializeCreateJoinAutocompleteBehavior() {
    
    var resultsContainer = $('#create_join_results');
    var createNewTemplate = $('#create_new_result');
    var resultTemplate = $('#create_join_result');
    
    /* This function is called when auto complete runs, and data is retrieved */
    var autoCompleteResponse = function(resultsContainer, createNewTemplate, resultTemplate) {
        return function(data, term) {
            /* results were found! */
            if(data.length) {
                resultsContainer.html('');
                for(i = 0, il = data.length; i < il; i++) {
                    var obj = data[i].fields
                    resultsContainer.append(resultTemplate.tmpl({
                        name: obj.name, 
                        id: obj.pk
                    }));
                }
            }
            /* No results :( */
            else {
                resultsContainer.html(createNewTemplate.tmpl({
                    query: term, 
                }));
            }
        };
    }(resultsContainer, createNewTemplate, resultTemplate);
    
    
    $('#create_join_input').autocomplete({
        minLength: 2,
        source: function(resultsContainer, myResponse) {
            
            return function(request, response) {
                                
                var term = request.term;
                lastXhr = $.getJSON('search/'+term, {}, function(data, status, xhr) {
                    if(xhr === lastXhr) {
                        myResponse(data, term);                         
                    }
                    
                })
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
                console.log('data:');
                console.log(data);
            }
        });
    });
}