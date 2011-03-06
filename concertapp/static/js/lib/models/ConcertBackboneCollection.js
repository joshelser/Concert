/**
 *  @file       ConcertBackboneCollection.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  A ConcertBackboneCollection is our extension of Backbone.Collection to include
 *  functionality that all collections need.
 **/
var ConcertBackboneCollection = Backbone.Collection.extend({
    
    initialize: function(models, options) {
        this.relatedModel = options.relatedModel;
    }, 
    
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
     *  Override internal remove method to allow to save our o2m relationship.
     *
     *  @param  {Boolean}    options.save    -  Wether or not to save this relation.
     *  @param  {Function}    options.error    -    Error callback.
     **/
    _remove : function(model, options) {
        options || (options = {});

        model = Backbone.Collection.prototype._remove.call(this, model, options);

        if(options.save) {
            var method = 'delete';
            var wrapErrorHelper = com.concertsoundorganizer.helpers.wrapError;
            options = wrapErrorHelper(options);

            options.url = this.relatedModel.url()+model.url({noBase:true});

            options.error = com.concertsoundorganizer.helpers.backboneWrapError(options.error, null, options);

            (this.sync || Backbone.sync)(method, null, options);
        }
    },
     
     
    
});
