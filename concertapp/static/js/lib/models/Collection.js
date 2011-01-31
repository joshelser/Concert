/**
 *  @file       Collection.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  A Collection object represents a django Collection object.
 *  @class
 **/
var Collection = ConcertBackboneModel.extend({
    
    oneToManyAttributes: function() {
        return [
            {
                attr: 'requests', 
                collectionType: RequestSet
            },
            {
                attr: 'users', 
                collectionType: UserSet
            }
        ];
    },
    foreignKeyAttributes: function() {
        return [
            {
                attr: 'admin', 
                model: User, 
            }
        ]
    },
    url: function() {
        var base = '/api/1/collection/';
        var id = this.get('id');
        if(id) {
            return base+id+'/';
        }
        else {
            return base;
        }
    },
    /**
     *  Here we will join the collection.  This will happen when the user presses the
     *  join button.
     **/
    requestToJoin: function() {
        var reqs = this.get('requests');
        reqs.create({
            user: com.concertsoundorganizer.page.user.url(), 
            collection: this.url()
        });
    }, 
    /**
     *  Revoke a request to join this collection.
     **/
    revokeRequest: function() {
        var collection_id = this.id;

        $.getJSON('revoke/'+collection_id, 
            function(me){ 
                return function(data, status){
                    if(status == 'success' && data.status == 'success') {
                        me.trigger('revoke_success');
                    }
                    else {
                        me.trigger('revoke_error', data.notification);
                    }
                }; 
            }(this)
        );
    }
});


/**
 *  A Collections object represents a collection of django Collection objects.
 *  (I know, really confusing.  Uppercase Collection means a "Concert Collection", 
 *  while lowercase collection just means a set or array)
 *  @class
 **/
var CollectionSet = ConcertBackboneCollection.extend({
    model: Collection,
    
    getSeenInstances : function() {
        return com.concertsoundorganizer.datasetManager.seenCollections;
    },
});
