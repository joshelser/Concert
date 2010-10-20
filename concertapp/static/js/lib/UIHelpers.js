/**
 *  @file       UIHelpers.js
 *  Functions associated with general UI elements.
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  This will auto clear the fields that have a class "autoClear" on them.
 *  The placeholder text is from the "data-placeholder" attribute of the 
 *  element.
 **/
function initializeAutoClearFieldBehavior(){
    
    /* Make jQuery local for performance */
    var $ = jQuery;
    
    $('input.autoClear').live('focus', function(event) {
        /*  If the placeholder attribute hasn't been set yet */
        if (!$(this).data('placeholder')) {
            /* save what is in the field */
            $(this).data('placeholder', $(this).val());
        }
        
        /* If the text field was just focused and has the placeholder text */
        if ($(this).val() == $(this).data('placeholder')) {
            /* remove placeholder text */
            $(this).val('');
        }
    }).live('blur', function(event) {        
        /* When field is blurred, put placeholder text back */
        if ($.trim($(this).val()) == '') {
            $(this).val($(this).data('placeholder'));
        }
    });
    
}