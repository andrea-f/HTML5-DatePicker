
/**
 * Global application parameters
 * @type {Object}
 * @private
 */
var main = {  
    },
   /**
    * Global json data information populated after file load.
    * @type {Object}
    * @private
    */
    jsonData;


/*
 * Application entry point.
 */
main.onLoad = function () {
    dateController.func.initData();
    jsonData = dateController.func.loadJSON();    
    dateController.func.dataToInput(jsonData);
    dateController.func.dataToBars(jsonData);    
};

/*
 * Simple logging utilty, try catch is for IE
 */
main.log = function (text) {
    try {
        console.log(text);
    } catch (err) {
        throw err;
    }
}