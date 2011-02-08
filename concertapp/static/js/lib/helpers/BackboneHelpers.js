/**
*  Override of Backbone.sync so we can handle related fields better.
**/

// Map from CRUD to HTTP for our default `Backbone.sync` implementation.
var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read'  : 'GET'
};

// Helper function to get a URL from a Model or Collection as a property
// or as a function.
var getUrl = function(object) {
  if (!(object && object.url)) return null;
  return _.isFunction(object.url) ? object.url() : object.url;
};


Backbone.sync = function(method, model, options) {
    var type = methodMap[method];
    
    // Default JSON-request options.
    var params = _.extend({
        type:         type,
        contentType:  'application/json',
        dataType:     'json',
        processData:  false
    }, options);

    // Ensure that we have a URL.
    if (!params.url) {
        params.url = getUrl(model) || urlError();
    }
    

    // Ensure that we have the appropriate request data.
    if (!params.data && model && (method == 'create' || method == 'update')) {
        var data = model.toJSON();
        
        for(var key in data) {
            var attr = data[key];
            /* This makes sure that only the URL of a related object is sent */
            if(attr instanceof Backbone.Model) {
                data[key] = data[key].url();
            }
            /* This makes sure that only URLS of related objects in 
            collections are sent */
            else if(attr instanceof Backbone.Collection) {
                /* Create list of urls */
                data[key] = [];
                attr.each(function(result){
                    return function(obj) {
                        result.push(obj.url());
                    }
                }(data[key]));
            }
        }
        params.data = JSON.stringify(data);
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (Backbone.emulateJSON) {
        params.contentType = 'application/x-www-form-urlencoded';
        params.processData = true;
        params.data        = params.data ? {model : params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (Backbone.emulateHTTP) {
        if (type === 'PUT' || type === 'DELETE') {
            if (Backbone.emulateJSON) params.data._method = type;
            params.type = 'POST';
            params.beforeSend = function(xhr) {
                xhr.setRequestHeader('X-HTTP-Method-Override', type);
            };
        }
    }

    // Make the request.
    $.ajax(params);
};

/**
 *  Helps to display error to user.
 **/
 com.concertsoundorganizer.helpers.wrapError = function(options) {
     if(options){
         /* Get error messsage provided from caller */
         var error_message = options.error_message;        
     }
     else {
         options = {};
     }

     if(typeof(error_message) == 'undefined') {
         var error_message = 'An error has occurred';
     }

     /* Wrap error callback */
     options.error = function(error_message, callback) {
         return function(model, resp) {
             resp = JSON.parse(resp.responseText);
             if(resp.error_message) {
                 error_message += ': '+resp.error_message;
             }
             else {
                 error_message += '.';
             }

             /* display error to the user */
             com.concertsoundorganizer.notifier.alert({
                 title: 'Error', 
                 content: error_message
             });

             if(callback) {
                 callback();
             }
         }

         }(error_message, options.error_callback);

         return options;
     }