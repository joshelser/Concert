/**
 *  @file       ManageCollectionsPanel.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  A class for managing the user's collections on the manage collections page.
 *  @class
 *  @extends Panel
 **/
var ManageCollectionsPanel = Panel.extend({
    
    /**
     *  @constructor
     **/
    initialize: function() {
        Panel.prototype.initialize.call(this);
        
        var params = this.options;
        
        var contents = this.contents;
        
        var $ = jQuery;
        
        /**
         *  Templates for manage collection widgets
         **/
        var memberCollectionTemplate = $('#manage_member_collection_template');
        if(typeof(memberCollectionTemplate) == 'undefined') {
            throw new Error('memberCollectionTemplate is undefined');
        }
        else if(memberCollectionTemplate.length == 0) {
            throw new Error('memberCollectionTemplate not found');
        }
        this.memberCollectionTemplate = memberCollectionTemplate;

        var adminCollectionTemplate = $('#manage_admin_collection_template');
        if(typeof(adminCollectionTemplate) == 'undefined') {
            throw new Error('adminCollectionTemplate is undefined');
        }
        else if(adminCollectionTemplate.length == 0) {
            throw new Error('adminCollectionTemplate not found');
        }
        this.adminCollectionTemplate = adminCollectionTemplate;

        var requestCollectionTemplate = $('#manage_request_collection_template');
        if(typeof(requestCollectionTemplate) == 'undefined') {
            throw new Error('requestCollectionTemplate is undefined');
        }
        else if(requestCollectionTemplate.length == 0) {
            throw new Error('requestCollectionTemplate not found');
        }
        this.requestCollectionTemplate = requestCollectionTemplate;
        
        
        var collectionsTable = $(contents).children('#manage_collections_table');
        if(typeof(collectionsTable) == 'undefined' || collectionsTable.length == 0) {
            throw new Error('collectionsTable not found');
        }
        this.collectionsTable = collectionsTable;
        
        var collectionsTableHeader = $(contents).find('#manage_collections_table_header');
        if(typeof(collectionsTableHeader) == 'undefined' || collectionsTableHeader.length == 0) {
            throw new Error('collectionsTableHeader not found');
        }
        this.collectionsTableHeader = collectionsTableHeader;
        
        var userCollections = params.userCollections;
        if(typeof(userCollections) == 'undefined') {
            throw new Error('params.userCollections is undefined');
        }
        this.userCollections = userCollections;
        
        var userRequests = params.userRequests;
        if(typeof(userRequests) == 'undefined') {
            throw new Error('params.userRequests is undefined');
        }
        this.userRequests = userRequests;

        

        
        
        
        
        _.bindAll(this, "render");
        /* Bind collection events to render */
        userCollections.bind('refresh', this.render);
        userCollections.bind('add', this.render);
        userCollections.bind('remove', this.render);
        userRequests.bind('refresh', this.render);
        userRequests.bind('add', this.render);
        userRequests.bind('remove', this.render);
    },
    render: function() {

        /* Temporary fragment for all DOM additions */
        var frag = document.createDocumentFragment();

        /* The header will always be first in the table */
        frag.appendChild(this.collectionsTableHeader.get(0))


        var renderCollectionWidget = function(panel, frag) {
            return function(collection){
                /* Create a ManageCollectionWidget */
                var widget = new ManageCollectionWidget({
                    template: panel.collectionTemplate, 
                    model: collection, 
                    panel: panel
                });
            
                frag.appendChild(widget.render().el);
            };
        }(this, frag);
        
        /* For each collection object */
        var collections = this.userCollections;
        collections.each(renderCollectionWidget);
        
        console.log('collections.toJSON():');
        console.log(collections.toJSON());
        
        /* For each request (collection) object */
        var requests = this.userRequests;
        console.log('requests.toJSON():');
        console.log(requests.toJSON());
        requests.each(renderCollectionWidget);
        

        /* Update manage collections list */
        this.collectionsTable.empty().append(frag);

        return this;
    }
});
