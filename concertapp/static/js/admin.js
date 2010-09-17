/**
*  @file admin.js
*  admin.js contains all of the functionality associated with the admin page interface.
**/

(function() {
    /**
    *  Upload Audio
    **/
    var options = { 
        data:   {"ajax": "1"},
        dataType: "script",
        clearForm: true,
        resetForm: true,
        success:    function(statusText, responseText) {
            var responseMessage;
            if(responseText == 'success')
                responseMessage = "File Uploaded Successfully";
            else
                responseMessage = "You either didn't provide a file or it was of the wrong type";
            alert(responseMessage);
        }
    };  
    $('#upload_audio > form').ajaxForm(options);
    

})();
