/**
 *  @file       ConcertBackboneModel.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  This is the class that all of our models inherit from, and provides special 
 *  functionality that we need for each model.
 **/
var ConcertBackboneModel = Backbone.Model.extend({
    
    /**
     *  On set, make sure all foreign key attributes and many to many attributes are
     *  handled properly.  This requires that the model has oneToManyAttributes and
     *  foreignKeyAttributes set on the model.  If these values are not set, 
     *  the function passes the attributes through as normal.
     *
     *  Here is an example of oneToManyAttributes and foreignKeyAttributes that
     *  should be set on the model:
     *
     *  oneToManyAttributes: function() { return [
     *      {
     *          attr: 'requests', 
     *          collectionType: RequestSet
     *      },
     *      {
     *          attr: 'users', 
     *          collectionType: UserSet
     *      }
     *  ]},
     *  foreignKeyAttributes: function () { return [
     *      {
     *          attr: 'admin', 
     *          model: User, 
     *      }
     *  ]}
     **/
    set: function(attributes, options) {
        
        var oneToManyAttributes = this.oneToManyAttributes();
        var foreignKeyAttributes = this.foreignKeyAttributes();
        
        if(oneToManyAttributes) {
            for(var i = 0, il = oneToManyAttributes.length; i < il; i++) {
                var manyToMany = oneToManyAttributes[i];
                
                var models = attributes[manyToMany.attr];
                /* If we're trying to set the related model and it is not
                    a collection */
                if(models && !(models instanceof Backbone.Collection)) {
                    
                    /* It is either a list of strings or objects */
                    if(models[0] && (models[0] instanceof Object)) {
                        /* Create new collection of request objects */
                        attributes[manyToMany.attr] = new manyToMany.collectionType(models);
                        
                    }
                    else if(models[0] && typeof(models[0]) == "string") {
                        /* We've got a list of urls */
                        throw new Error('Not handling related objs as urls currently, send the full object.');
                    }
                    else {
                        throw new Error('Do not know how to handle this attribute: '+models);
                    }
                    
                }
                /*  Requests member is not being set now, and it hasn't been 
                    set yet */
                else if(!models && !this.get(manyToMany.attr)) {
                    /* Set it to an empty set in case we want to add requests */
                    attributes[manyToMany.attr] = new manyToMany.collectionType;
                }            
                
            }
        }
        
        if(foreignKeyAttributes) {
            
        }
        
        Backbone.Model.prototype.set.call(this, attributes, options);
    },
    oneToManyAttributes: function(){
        return null;
    },
    foreignKeyAttributes: function() {
        return null;
    }
});