/**
*  @file       CreateJoinCollectionPanel.js
*  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  This is the panel that allows a user to create or join a group on the settings
 *  page.
 *	@class
 **/
/**
 *  
 *  @class
 **/
var CreateJoinCollectionPanel = Panel.extend({
    
    /**
    *  Initialize all stuffs.  We have an element for the input, as well as for the
    *  results.
    *   @constructor
    **/    
    initialize: function() {
        Panel.prototype.initialize.call(this);
        
        var params = this.options;
        
        var contents = this.contents;
        
        /**
         *  The input element where the user searches for a collection
         **/
        var inputElement = contents.find('.create_join_input');
        if(typeof(inputElement) == 'undefined' || inputElement.length == 0) {
            throw new Error('inputElement not found');
        }
        this.inputElement = inputElement;
        
        
        /**
         *  The Backbone.js collection of django Collection objects for search
         *  results.
         **/
        var searchResults = new Collections;
        this.searchResults = searchResults;
        
        /* Another model object for the exact result (if one exists) */
        var exactResult = new Collection;
        this.exactResult = exactResult;

        /**
         *  The search result widget that displays the search results.
         **/
        var searchResultsWidget = new CollectionSearchResultsWidget({
            el: contents.find('.create_join_results'), 
            collection: searchResults, 
            panel: this, 
            exactResult: exactResult, 
        });

        /* This will hold a reference so we can keep track of the last Xhr */
        this.lastCreateJoinXhr = null;

        /* The current search term in the box */
        this.currentTerm = null;
        
        /* Initialize the auto complete behavior */
        this.initAutoCompleteBehavior();

        _.bindAll(this, "render");
        this.render();
    },
    render: function() {
        
        
        
        return this;
    },
    
    events: {

    }, 
    
    /**
     *  This should be called from init just once, to initialize the auto complete
     *  behavior for the input element.
     **/
    initAutoCompleteBehavior: function() {
        /* The actual jQuery UI autocomplete call */
        this.inputElement.autocomplete({
            minLength: 0,
            source: function(me) {
                return function(request, response) {
                    /* Our search term */
                    var term = request.term;

                    /* If there is something to search for */
                    if(term && term != '') {    
                        /* Search for it */

                        me.toggleLoadingNotification();
                        me.lastCreateJoinXhr = $.getJSON(
                            'search/'+term+'/', 
                            {}, 
                            function(data, status, xhr) {
                                /* If this was the last request made (ignore previous) */
                                if(xhr === me.lastCreateJoinXhr) {
                                    me.currentTerm = term;
                                    
                                    me.exactResult.parse(data.exact);
                                    
                                    console.log('me.searchResults.length:');
                                    console.log(me.searchResults.length);
                                    me.searchResults.refresh(data.results);
                                    console.log('me.searchResults.length:');
                                    console.log(me.searchResults.length);
                                    
                                    me.toggleLoadingNotification();
                                }
                            }
                        );
                    }
                    /* Search is empty */
                    else {
                        me.currentTerm = term;
                        me.searchResults.refresh([]);
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
    },

});
