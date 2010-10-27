/**
 *  @file       Button.js
 *  All buttons will inherit from this class.  Contains functionality that is
 *  necessary for all buttons.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
function Button(params) {
    if(params) {
        this.init(params);
    }
}


/**
 *  Initializes behavior for buttons.
 *
 *  @param  params.container            jQuery HTMLDivElement - The DOM element that
 *                                      all of the buttons behaviors will be assigned
 *                                      to.
 *
 **/
Button.prototype.init = function(params) {

    /* Container where all of the behavior is assigned to */
    var container = params.container;
    /* Required */
    if(typeof(container) == 'undefined') {
        throw new Error('params.container is undefined');
    }
    this.container = container;


    /* Assign behavior to container */
    container.mouseout(function(me){
        return function() {
            me.hoverOut();
        }
    }(this)); 
    container.mouseover(function(me){
        return function() {
            me.hoverIn();
        }
    }(this));
    container.click(function(me){
        return function(){
            me.click();
        };
    }(this));

    
    
}

/**
 *  When container is clicked, this function will be called.  Right now we don't
 *  need to do anything.  This should be implemented in subclasses.
 *
 **/
Button.prototype.click = function() {
    
}

/**
 *  When container is hovered, this function will be called.  Should be implemented
 *  in subclasses.
 **/
Button.prototype.hoverIn = function() {
    
}

/**
 *  When container is hovered out, this function will be called.  Should be 
 *  implemented in subclasses.
 **/
Button.prototype.hoverOut = function() {
    
}