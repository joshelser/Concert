/**
 *  @file       Tag.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  A tag object.
 *
 *  @class
 *  @extends    ConcertBackboneModel
 **/
var Tag = ConcertBackboneModel.extend({
    foreignKeyAttributes: function() {
        return [
            {
                attr: 'creator', 
                model: User 
            }
        ];
    },
    name: 'tag', 
})