/**
*  @file manageTags.js
*  manageTags.js contains all of the functionality associated with the manage Tags interface
**/

(function() {
    /*  Make main table sortable and searchable.  There are some options
        that can go here to modify the look and properties of the DOM 
        elements that are generated, I haven't looked into it too much. */
    $('table#tag_list').dataTable({
        'sDom': '<"above_table"f>t<"below_table"ilp>', 
    });    
    
    
    /* Behavior when rename tag button is clicked */
    $('.tagNameEdit').live('click', function(){
        /* Get ID from row */
        var tagID = get_object_id(this);
        rename_tag(tagID);
    });
    
    /* Behavior when save button is clicked on tag rename */
    $('.tagNameSave').live('click', function(){
        /* get ID from row */
        var tagID = get_object_id(this);
        save_tag_name(tagID);
    });

    /* Behavior when tag count is clicked initially */
    $('.tagCount.closed > .tagCountButton').live('click', function(){
        /* Get id of tag */
        var tagID = get_object_id(this);
        get_tag_segments(tagID);
    });
    /* Behavior when tag count is when the tag's segments are being displayed */
    $('.tagCount.open > .tagCountButton').live('click', function(){
        /* Get id of this tag */
        var tagID = get_object_id(this);
        hide_tag_segments(tagID);
    });
    /* Behavior when tag count is clicked when segments are hidden */
    $('.tagCount.hidden > .tagCountButton').live('click', function(){
        /* Get id of this tag */
        var tagID = get_object_id(this);
        show_tag_segments(tagID);
    });
})();


/**
 *  rename_tag
 *  This is called whenever the edit button is clicked with a corresponding tag name.
 *
 *  @param          tagID           the id of the Tag object whos name is going to be changed.
 **/
function rename_tag(tagID) {
    /* Get current tag name */
    var tagName = $('#tagName-'+tagID).html();
    /* Save current tag name in element for comparison later */
    $('#tagName-'+tagID).attr('data-oldname', tagName);
    
    /* Change name field into text input field */
    $('#tagName-'+tagID).html('<input type="text" value="'+tagName+'" />');
    $('#tagRename-'+tagID).removeClass('tagNameEdit').removeClass('pencil').addClass('check').addClass('tagNameSave');
}

/**
 *  save_tag_name
 *  This is called whenever the save button is pressed corresponding to a tag name.
 *
 *  @param          tagID           the id of the Tag object whos name may be changed.
 **/
function save_tag_name(tagID) {
    /* Get new tag name */
    var newTagName = $('#tagName-'+tagID+' > input').attr('value');
    /* Get old tag name */
    var oldTagName = $('#tagName-'+tagID).attr('data-oldname');
    
    /* If the tag name has not changed */
    if(newTagName == oldTagName) {
        /* Act like it has saved successfully */
        tag_name_saved(tagID, newTagName);
    }
    /* Tag name needs to change */
    else {
        /* Replace button with Loading notification */
        $('#tagRename-'+tagID).removeClass('check').addClass('loading');
        
        /* Update tag name in database */
        $.ajax({
            type: 'POST',
            url: '/tags/updateTagName/',
            data: {tagID: tagID, tagName: newTagName},
            success: function(data, textStatus){
                /* If tag was saved successfully */
                if(textStatus == 'success' && data == 'success'){
                    /* Update interface */
                    tag_name_saved(tagID, newTagName);
                }
                /* There was some sort of error, hopefully details are in the data variable */
                else {
                    /* Put back check button */
                    $('#tagRename-'+tagID).removeClass('loading').addClass('check');
                    
                    alert('Error: '+data);
                }
            }
        });
    }
}

/**
 *  tag_name_saved
 *  This is called whenever the tag name is successfully saved, and the interface should be updated
 *  back to normal.
 *
 *  @param              tagID           The id of the Tag object
 *  @param              newTagName      The new name.
 **/
function tag_name_saved(tagID, newTagName) {
    /* Change name field back to just displaying tag name */
    $('#tagName-'+tagID).html(newTagName);
    /* Change button back to edit button */
    $('#tagRename-'+tagID).removeClass('loading').removeClass('tagNameSave').addClass('tagNameEdit').removeClass('check').addClass('pencil');
}

/**
 *  get_tag_segments
 *  Retrieves the segments for the associated tag.  This should be called the first time the 
 *  segments button is clicked for each tag.
 *
 *  @param              tagID               the id of the tag object.
 **/
function get_tag_segments(tagID) {
    /* Get tag segments from database */
    $.ajax({
        type: 'GET',
        url: '/tags/getTagSegments/'+tagID+'/',
        success: function(data, textStatus){
            /* If request was successful */
            if(textStatus == 'success') {
                /* Create new row and insert retrieved table */
                var newRow = $('<tr>').attr('id', 'tagSegments-'+tagID).addClass('tagSegments').html($('<td>').attr('colspan', '4').html(data));
                /* Put row after this tag row */
                $('#tag-'+tagID).after(newRow);
                /* Change class of segment count td */
                $('td#tagCount-'+tagID).removeClass('closed').addClass('open');
                /* Change class of button */
                $('#tagCountButton-'+tagID).removeClass('tags-label').addClass('tags');
            }
            else {
                alert('Error: an error has occurred.');
            }
        }
    });
}

/**
 *  hide_tag_segments
 *  This is called whenever the tag segments button is pressed if the segments are already begin shown.
 *  
 *  @param          tagID           The id of the Tag object.
 **/
function hide_tag_segments(tagID) {
    /* hide sibling of this tag row */
    $('#tag-'+tagID).next().hide();
    /* Change class to hidden */
    $('#tagCount-'+tagID).removeClass('open').addClass('closed');
    /* Change button */
    $('#tagCountButton-'+tagID).removeClass('tags').addClass('tags-label');
}

/**
 *  show_tag_segments
 *  This is called whenever the tag segments button is pressed if the segments have alread
 *  been retrieved, but have been hidden.
 *
 *  @param                  tagID                   The id of the tag object.
 **/
function show_tag_segments(tagID) {
    /* Show sibling of this tag row */
    $('#tag-'+tagID).next().show();
    /* Change class to open */
    $('#tagCount-'+tagID).removeClass('hidden').addClass('open');
    /* Change button */
    $('#tagCountButton-'+tagID).removeClass('tags-label').addClass('tags');
}
