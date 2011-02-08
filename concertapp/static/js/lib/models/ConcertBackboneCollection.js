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
     **/
    _add : function(model, options) {
        
        var seenInstances = com.concertsoundorganizer.modelManager.seenInstances[this.model.prototype.name];

        /* If the model hasn't yet been instantiated */
        if(!(model instanceof Backbone.Model)) {
            /* Check with dataset manager to see if it already exists */
            
            var possibleDuplicate = seenInstances.get(model.id);

            /* If there is a duplicate */
            if(possibleDuplicate) {
                /* Send the attributes to the duplicate incase there are new ones */
                possibleDuplicate.set(model);

                /* Use duplicate moving forward */
                model = possibleDuplicate;
            }
            /* If there is not a duplicate, create new instance */
            else {
                model = new this.model(model);
                
                seenInstances.add(model);
            }   
        }

        return Backbone.Collection.prototype._add.call(this, model, options);
    },
    
    /**
     *  Display modal error to user when error occurs.
     **/
     save : function(attrs, options) {
         var wrapErrorHelper = com.concertsoundorganizer.helpers.wrapError;
         
         return Backbone.Collection.prototype.save.call(this, attrs, wrapErrorHelper(options));
     }
    
});
