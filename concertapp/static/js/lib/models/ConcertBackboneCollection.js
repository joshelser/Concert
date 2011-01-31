/**
 *  @file       ConcertBackboneCollection.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  A ConcertBackboneCollection is our extension of Backbone.Collection to include
 *  functionality that all collections need.
 **/
var ConcertBackboneCollection = Backbone.Collection.extend({
    
    /**
     *  Overriding this method allows for each collection to be aware of the master
     *  list of model instances, so no duplicate instances are ever created.
     *  This requires that each subclass has a getSeenInstances method, which 
     *  will retrieve all of the seen instances of the appropriate model from
     *  the Dataset Manager.
     **/
    _add : function(model, options) {

        /* If the model hasn't yet been instantiated */
        if(!(model instanceof Backbone.Model)) {
            /* Check with dataset manager to see if it already exists */
            var seenInstances = this.getSeenInstances();

            var possibleDuplicate = seenInstances.get(model.id);

            /* If there is a duplicate */
            if(possibleDuplicate) {
                /* Send the attributes to the duplicate incase there are new ones */
                possibleDuplicate.set(model);

                /* Use duplicate moving forward */
                model = possibleDuplicate;
            }            
        }

        return Backbone.Collection.prototype._add.call(this, model, options);
    },
});
