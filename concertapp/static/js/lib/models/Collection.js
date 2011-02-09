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
    name: 'Collection',
    /**
     *  When a user wants to join a collection.
     **/
    requestToJoin: function() {
        var reqs = this.get('requests');
        reqs.create({
            user: com.concertsoundorganizer.page.user.url(), 
            collection: this.url()
        });
    },
    /**
     *  When a user wants to leave the collection.
     **/
    leave: function() {
        var modelManager = com.concertsoundorganizer.modelManager;
        var user = modelManager.user;
        var userMemberCollections = modelManager.userMemberCollections;
        /* Remove user */
        this.get('users').remove(user);
        /* Remove collection from memberCollections */
        userMemberCollections.remove(this);
        
        this.save(null, {
            error_message: 'An error occured while leaving the collection', 
            error_callback: function(me, userMemberCollections, removedUser) {
                return function() {
                    me.get('users').add(removedUser);
                    userMemberCollections.add(me);
                };
            }(this, userMemberCollections, user), 
        });
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
});
