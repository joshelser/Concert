/**
*  @file       CreateJoinCollectionPanel.js
*  This is the panel that allows a user to create or join a group on the settings
*  page.
*  @author     Colin Sullivan <colinsul [at] gmail.com>
**/

function CreateJoinCollectionPanel(params) {
    if(params) {
        this.init(params);
    }
}
CreateJoinCollectionPanel.prototype = new Panel();

/**
*  Initialize all stuffs.  We have an element for the input, as well as for the
*  results.
*
*  @param  createJoinInputElement          jQuery HTMLInputElement for the input
*                                          text box.
*  @param  createJoinResultsElement        jQuery HTMLDivElement for the results
*                                          dropdown.
*  @param  createJoinResultTemplate        jQuery tmpl script element.  The template
*                                          for results in the auto-complete dropdown
*  @param  createJoinCreateNewTemplate     jQuery tmpl - the template for the 
*                                          "Create new collection"  button in the
*                                          auto complete dropdown.
**/
CreateJoinCollectionPanel.prototype.init = function(params) {
    Panel.prototype.init.call(this, params);

    var createJoinInputElement = params.createJoinInputElement;
    if(typeof(createJoinInputElement) == 'undefined') {
        throw new Error('params.createJoinInputElement is undefined');
    }
    this.createJoinInputElement = createJoinInputElement;

    var createJoinResultsElement = params.createJoinResultsElement;
    if(typeof(createJoinResultsElement) == 'undefined') {
        throw new Error('params.createJoinResultsElement is undefined');
    }
    this.createJoinResultsElement = createJoinResultsElement;

    var createJoinResultTemplate = params.createJoinResultTemplate;
    if(typeof(createJoinResultTemplate) == 'undefined') {
        throw new Error('params.createJoinResultTemplate is undefined');
    }
    this.createJoinResultTemplate = createJoinResultTemplate;

    var createJoinCreateNewTemplate = params.createJoinCreateNewTemplate;
    if(typeof(createJoinCreateNewTemplate) == 'undefined') {
        throw new Error('params.createJoinCreateNewTemplate is undefined');
    }
    this.createJoinCreateNewTemplate = createJoinCreateNewTemplate;

    /* This will hold a reference so we can keep track of the last Xhr */
    this.lastCreateJoinXhr = null;

    /* The current search term in the box */
    this.currentTerm = null;

    /* Auto complete behavior */
    this.initAutoCompleteBehavior();
    
    /* When "create new collection" button is pressed */
    $('#create_new_collection').live('click', function(me) {
        return function() {
            me.createNewCollection({
                collection_name: $(this).attr('data-collection_name'), 
            });
        };
    }(this));
}

/**
 *  This should be called from init just once, to initialize the auto complete
 *  behavior for the input element.
 **/
CreateJoinCollectionPanel.prototype.initAutoCompleteBehavior = function() {
    /* The actual jQuery UI autocomplete call */
    this.createJoinInputElement.autocomplete({
        minLength: 0,
        source: function(me) {
            return function(request, response) {
                /* Our search term */
                var term = request.term;

                /* If there is something to search for */
                if(term && term != '') {    
                    /* Search for it */
                    me.lastCreateJoinXhr = $.getJSON(
                        'search/'+term, 
                        {}, 
                        function(data, status, xhr) {
                            /* If this was the last request made (ignore previous) */
                            if(xhr === me.lastCreateJoinXhr) {
                                me.currentTerm = term;
                                me.autoCompleteResponse(data);
                            }
                        }
                    );
                }
                /* Search is empty */
                else {
                    me.currentTerm = term;
                    me.autoCompleteResponse([]);
                }
            };

        }(this),

        open: function(event, ui) {
        },

        change: function(event, ui) {
        },

        search: function(event, ui) {
        }
    });
}

/**
*  This should be called when an autocomplete request finishes, and we wish
*  to display the results to the user.
*
*  @param  data        Object  - JSON data from server about collection search
*                                  results.
**/
CreateJoinCollectionPanel.prototype.autoCompleteResponse = function(data) {
    var resultsContainer = this.createJoinResultsElement;
    var createNewTemplate = this.createJoinCreateNewTemplate;
    var resultTemplate = this.createJoinResultTemplate;
    var term = this.currentTerm;
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
            term: term, 
        }));
    }
    /* No search term */
    else {
        resultsContainer.empty();
    }
}

/**
 *  Should be called when the 'Create new collection' button is pressed.  This
 *  behavior is defined in init. 
 *
 *  @param  params.collection_name        String  - The name of the collection to 
 *                                          create.
 **/
CreateJoinCollectionPanel.prototype.createNewCollection = function(params) {
    /* Add new collection */
    $.ajax({
        type: 'POST',
        url: 'add/',
        data: { name: params.collection_name },
        success: function(me) {
            return function(data, status, xhr) {
                /* if collection was added */
                if(data == 'success') {
                    /* notify user */
                    com.concertsoundorganizer.notifier.alert({
                        'title': 'Success!', 
                        'content': 'Your collection was created succesfully.'
                    });

                    /* Update collection table */
                    updateManageCollectionsList();

                }
                /* an error occurred */
                else {
                    com.concertsoundorganizer.notifier.alert({
                        'title': 'Error',
                        'content': 'Your collection was not created.'
                    });

                    this.createJoinResultsElement.empty();
                }
            };
        }(this)
    });
}