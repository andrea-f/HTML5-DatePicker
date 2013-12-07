var dateController = dateController || {};

dateController.func = (function ($) {
   /**
    * Creates text input section
    * @type {Object}
    * @private
    */
    var newSection,
       /**
        * Holds date information with name, from and to.
        * @type {Object}
        * @private
        */
        jsonData;

    /**
     * Initializes UI elements
     * @private
     */
    function initData() {
        dateView.func.createUIElements();
        dateView.func.datesBlock();
    }

    /**
     * Calls dateLoad to load JSON information from file.
     * @private
     */
    function loadJSON() {
        jsonData = dateLoad.func.loadJSON();
        return jsonData;
    }

    /**
     * Converts dates information to input text fields.
     * @param {Object} jsonData holds all dates, from to and name.
     * @private
     */
    function dataToInput(jsonData) {
        main.log('[dateController.dataToInput] Setting json data to input forms...');        
        newSection = dateView.func.displayDatesRange(jsonData);
        return newSection;
    }

   /**
    * Maps number reference to key in json data.
    * @type {Object}
    * @private
    */
    map = {
        "0": "name",
        "1": "from",
        "2": "to"
    }

   /**
    * Adds a name, from, to element to json data then updates UI with new information.
    * @private
    */
    function addWindow() {
        next = jsonData.length;
        jsonData[next] = {
            "name": "New window"+next,
            "from":"2013-11-13",
            "to":"2013-11-17"
        }
        dataToInput(jsonData);
        dataToBars(jsonData);
    }

   /**
    * Updates bars when data changes.
    * @type {Object} e holds event information generating the change.
    * @type {Number} a holds wether is name, from or to which was updated.
    * @type {Number} g holds index reference to item in json data.
    * @private
    */
    function dataChangeToBars(e,a,g) {
        if (map[a]) {
            jsonData[g][map[a]] = e.value;
        }
        dataToBars(jsonData);
    }

    /**
     * Converts dates to bars.
     * @param {Object} jsonData holds all dates, from to and name.
     * @private
     */
    function dataToBars(jsonData) {
        dateView.func.datesToBars(jsonData);       
    }
    
    /**
     * Converts bar changes to correct input date fields
     * @param {Object} updateInfo holds changed information.
     * @private
     */
    function barChangeToData(updateInfo) {
        endPos = updateInfo['endPos'];
        width = updateInfo['width'];
        idName = updateInfo['idName'];
        blockWidth = updateInfo['blockWidth'];
        monthWidth = updateInfo['monthWidth'];
        from = Math.floor(endPos/blockWidth) + 1;
        to = Math.floor(((endPos + width)/blockWidth)) + 1;
        upds = [from,to]
        idNum = parseInt(idName.split('-')[1]);
        if (jsonData[idNum]) {
            for (var b = 1; b <= upds.length; b++) {
                dt = jsonData[idNum][map[b]];
                if(dt.indexOf('-') !== -1) {
                    dt = dt.replace(/-/g,"/");
                }
                oldDate = dt.split('/')[2];
                oldDate < 10 ? oldDate = "0"+oldDate: remLen = 2;
                s = jsonData[idNum][map[b]].substring(0, jsonData[idNum][map[b]].length - 2);
                if (upds[b-1].toString().length < 2) {                    
                    upds[b-1] = "0"+upds[b-1].toString();                    
                }
                if (s.length < 11 && upds[b-1].toString().length <= 2) {
                    jsonData[idNum][map[b]] = s + upds[b-1].toString();  
                }
                
            }
            dataToInput(jsonData);
        }
    }

   /**
    * Prevents default behavior while dragging element.
    * @type {Object} e holds event information generating the change.
    * @private
    */
    function enableDrop(e) {
        e.preventDefault();
    }

   /**
    * Adds information to dataTransfer object from triggering event.
    * @type {Object} e holds event information generating the change.
    * @private
    */
    function drag(e) {
        nid = e.target.id;
        e.dataTransfer.setData("src",nid);
        e.dataTransfer.setData("initPos",e.target.style.left);
        e.dataTransfer.setData("barWidth",e.target.style.width);
        e.dataTransfer.setData("initMousePos",e.pageX);
        e.dataTransfer.setData("parentElement", e.target.parentNode.className);        
    }


   /**
    * Adds information to dataTransfer object from triggering event.
    * @type {Object} e holds event information generating the change.
    * @type {Object} config holds months and block sizes to update date input fields.
    * @private
    */
    function handleResizing(e, config) {
        inputUpdateInfo = {
            "endPos": parseInt(e.target.style.left),
            "width": parseInt(e.target.style.width),
            "blockWidth": parseInt(config['blockWidth']),
            "monthWidth": parseInt(config['monthWidth']),
            "idName": e.target.id.replace(/ /g,"_")
        };
        e.stopPropagation();
        barChangeToData(inputUpdateInfo);
    }

   /**
    * Adds information to dataTransfer object from triggering event.
    * @type {Object} e holds event information generating the change.
    * @private
    */
    function drop(e) {        
        var barId=e.dataTransfer.getData("src"),
            width=parseInt(e.dataTransfer.getData("barWidth")),
            initialLeftPos = parseInt(e.dataTransfer.getData("initPos")),
            initMousePos = parseInt(e.dataTransfer.getData("initMousePos")),
            mov = parseInt(e.pageX);
        endPos = parseInt(getMovementInformation(mov, initialLeftPos, initMousePos));
        config = dateView.func.updateAfterDrop(e, endPos, barId);        
        inputUpdateInfo = {
            "endPos": endPos,
            "width": width,
            "blockWidth": parseInt(config['blockWidth']),            
            "monthWidth": parseInt(config['monthWidth']),            
            "idName": barId
        };
        barChangeToData(inputUpdateInfo);
    }

   /**
    * Calculates movement information for correct repositioning of bars.
    * @type {Number} mov amount of mouse movement during DnD.
    * @type {Number} initialLeftPos is initial bar left position in pixels.
    * @type {Number} initMousePos is initial mouse position click on bar.
    * @return {Number} Resulting bar movement in pixels,
    * @private
    */
    function getMovementInformation(mov, initialLeftPos,initMousePos) {
        dist =  Math.abs(initialLeftPos - initMousePos);
        absMov = Math.abs(initialLeftPos - mov)
        if (mov >= initialLeftPos) {
            endPos = mov - dist;
        }
        if (mov <= initialLeftPos) {
            endPos = initialLeftPos - absMov - dist;
        }
        return endPos;
    }
    
   /**
    * Alerts current state of jsonData variable.
    * @private
    */
    function dumpData() {
        alert(JSON.stringify(jsonData, null, 4));
    }

    return {
       /**
        * Initializes UI elements.
        * @type {Function}
        */
        initData:initData,
       /**
        * Loads JSON from file.
        * @type {Function}
        */
        loadJSON: loadJSON,
       /**
        * Converts json data to input text fields.
        * @type {Function}
        */
        dataToInput: dataToInput,
       /**
        * Creates bars with date ranges information.
        * @type {Function}
        */
        dataToBars: dataToBars,
       /**
        * Updates input text fields changes to bars.
        * @type {Function}
        */
        dataChangeToBars: dataChangeToBars,
       /**
        * Enables drag operation.
        * @type {Function}
        */
        drag: drag,
       /**
        * Enables drop operation.
        * @type {Function}
        */
        drop: drop,
       /**
        * Prevents default behaviour when dropping an element.
        * @type {Function}
        */
        enableDrop: enableDrop,
       /**
        * Handles resizing an element.
        * @type {Function}
        */
        handleResizing: handleResizing,
       /**
        * Alerts current state of json data.
        * @type {Function}
        */
        dumpData: dumpData,
       /**
        * Adds default element to jsonData.
        * @type {Function}
        */
        addWindow: addWindow
    };
}(dateController || {}, jQuery));
