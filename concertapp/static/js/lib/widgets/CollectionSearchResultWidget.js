/**
 *  @file       CollectionSearchResultWidget.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  This widget is displayed for each collection in a collection search result.
 *  @class 
 *  @extend Widget
 **/
var CollectionSearchResultWidget = Widget.extend({
    
    initialize: function() {
        Widget.prototype.initialize.call(this);

        var params = this.options;
        
        var page = this.panel.page;
        
        /* Save references to userRequests collection and user */
        this.userRequests = page.userRequests;        
        this.user = page.user;
                
        _.bindAll(this, "render");
        this.render();
    },
    render: function() {
        Widget.prototype.render.call(this);
        
        return this;
    },
    events: {
        'click .collection_join_button': 'joinCollection', 
        'click .collection_info_button': 'showCollectionInfo', 
    }, 
    /**
     *  This will be executed when a user decides to join a collection.  Here
     *  we instantiate a new request object and put it into the userRequests 
     *  collection.
     **/
    joinCollection: function() {
        this.userRequests.create({
            collection: this.model.url(), 
            user: this.user.url() 
        });
        
        this.render();
    }, 
    showCollectionInfo: function() {
        console.log('showCollectionInfo');
    }, 
});