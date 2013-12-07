var dateLoad = dateLoad || {};

dateLoad.func = (function ($) {

    /**
    * Loads JSON from webserver
    * @private
    */
    function loadJSON() {
        var jsData;
        var fileLocation = "../s/window-array.json";
        jQuery.ajax({
            type : 'POST',
            async: false,
            dataType : 'json',
            url: fileLocation,
            success : function(data) {
                jsData = data;
            },
            error: function(data) {
                console.log("Error: "+ JSON.stringify(data, null, 4));                
            }            
        })
        jd = jsData;
        return jd;
    }

    return {
       /**
        * Loads JSON from webserver.
        * @type {Function}
        */
        loadJSON: loadJSON
    };
}(dateLoad || {}, jQuery));

