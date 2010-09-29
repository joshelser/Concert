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
                responseMessage = "ERROR: "+responseText;
            alert(responseMessage);
        }
        error:  function(statusText) {
            alert('ERROR: '+statusText)
        }
    };  
    $('#upload_audio > form').ajaxForm(options);
    

})();
