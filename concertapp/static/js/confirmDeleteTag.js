/**
*  @file confirmDeleteTag.js
*  confirmDeleteTag.js contains all of the functionality associated with the confirm delete page
**/

(function() {
    /*  Make main table sortable and searchable.  There are some options
        that can go here to modify the look and properties of the DOM 
        elements that are generated, I haven't looked into it too much. */
    $('table.tagSegments').dataTable({
        'sDom': '<"above_table"f>t<"below_table"ilp>', 
    });    
    
})();
