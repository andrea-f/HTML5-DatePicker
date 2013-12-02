var dateLoad = dateLoad || {};

dateLoad.func = (function ($) {

    /*
     * Loads data from Dinx Television API
     * @param {String} Type of information requested, has to be in informationTypes[viewBy]
     */
    function loadJSON(fileLocation) {
        main.log('[dateController.loadJSON] Loading JSON...');
        var jsData;
        var fileLocation = "http://localhost/saffron/window-array.json";
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
        /*try {
            jQuery.getJSON(fileLocation, function(json) {
                jsonData = json; // this will show the info it in firebug console
                alert(jsonData)
            });
            jd = eval("(" + jsonData + ")");
            alert(typeof jd)
        } catch(err) {
            throw err;
        }*/
        //var jsonData = JSON.stringify(eval(jsonData));
        jd = jsData;
        return jd;
    }

    /*
     * Stop currently playing video
     */
    function saveJSON() {
        main.log('[dateController.saveJSON] stopping video');

    }

    return {
        loadJSON: loadJSON,
        saveJSON: saveJSON
    };
}(dateLoad || {}, jQuery));


