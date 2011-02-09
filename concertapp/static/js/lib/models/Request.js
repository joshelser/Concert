/**
 *  @file       Request.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  A Request that represents a Request resource on the server.
 *  @class
 *  @extends    ConcertBackboneModel
 **/ 
var Request = ConcertBackboneModel.extend({
    
    foreignKeyAttributes: function() {
        return [
            {
                attr: 'user', 
                model: User
            },
            {
                attr: 'collection', 
                model: Collection 
            }
        ];
    },
    url: function() {
        var base = '/api/1/request/';
        var id = this.get('id');
        if(id) {
            return base+id+'/';
        }
        else {
            return base;
        }
    },
    name: 'Request', 
    /**
     *  When a user would like to revoke the request to join a collection.
     **/
    revoke: function() {
        var previousStatus = this.get('status');
        this.set({
            status: 'r'
        });
        this.save(null, {
            error_message: 'Couldn\'t revoke request', 
            error_callback: function(me, previousStatus) {
                return function() {
                    me.set({
                        status: previousStatus
                    });
                };
            }(this, previousStatus)
        });
    }, 
});

/**
 *  A set of Request objects.
 *  @class
 *  @extends    ConcertBackboneCollection
 **/
var RequestSet = ConcertBackboneCollection.extend({
    model: Request, 
});