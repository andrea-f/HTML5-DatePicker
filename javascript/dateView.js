var dateView = dateView || {};

dateView.config = dateView.config || {};


/**
 * UI configuration parameters
 * @type {Object}
 * @private
 */
dateView.config = {
    "days": 30,
    "month" : 11,
    "blockWidth": 40,
    "monthWidth": 1200
};

dateView.func = (function ($) {

    /**
     * Content holder for input forms
     * @type {Object}
     * @private
     */
    var windowDataElement = jQuery("<section id='window-data'></section>"),
        /**
         * Creates add window button
         * @type {Object}
         * @private
         */
        addWindowElement = jQuery("<button id='add-window' onclick='dateController.func.addWindow()'>Add Window</button>"),
        /**
         * Holds dates bars and enumerated days
         * @type {Object}
         * @private
         */
        windowDisplayElement = jQuery("<section id='window-display'></section>"),
        /**
         * Holds enumerated days
         * @type {Object}
         * @private
         */
        dateLabelsElement = jQuery("<div id='date-labels'></div>"),
        /**
         * Placeholder for one date range bar
         * @type {Object}
         * @private
         */
        windowBarElement = jQuery("<div class='window-container' id='window-container'></div>"),
        /**
         * Holds one date range bar
         * @type {Object}
         * @private
         */
        dateRangesElement = jQuery("<span class='window'></span>"),
        /**
         * Holds get data button
         * @type {Object}
         * @private
         */
        getDataElement = jQuery("<button id='add-window' onclick='dateController.func.dumpData()'>Get Data</button>");

    /**
     * Adds UI elements to window.
     * Also calls add bars movement to make bars draggable.
     * @private
     */
    function createUIElements() {
        jQuery('body').append(
            windowDataElement,
            addWindowElement,
            windowDisplayElement.append(dateLabelsElement),
            getDataElement
        );
    }


    /**
     * Capitalises the first letter of an input string.
     * @param {String} string Text to capitalise first letter.
     * @return {String} Capitalised string.
     * @private
     */
    function capitalise(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
     * Displays date ranges in input forms
     * @param {Object} jsonData holds all dates, from to and name.
     * @return {Object} windowDataElement holds all generated html code for inputs.
     * @private
     */
    function displayDatesRange(jsonData) {
        windowDataElement.html("");
        for (var g = jsonData.length; 0 <= g; g--) {
            var divElem = document.createElement('div');
            var a = 0;
            for (var prop in jsonData[g]) {
                if(jsonData[g].hasOwnProperty(prop)){
                    var labelElem = document.createElement('label');
                    lab = capitalise(prop);
                    labelElem.innerHTML = lab+":";
                    var inputElem = document.createElement('input');
                    if (prop !== "name") {
                        inputElem.setAttribute("type", "date");
                    }
                    inputElem.setAttribute("class",jsonData[g]['name'].replace(/ /g,"_")+g.toString())
                    inputElem.setAttribute("onchange", "dateController.func.dataChangeToBars(this,"+a+","+g+")");
                    inputElem.setAttribute("value", jsonData[g][prop]);
                }
                labelElem.insertBefore(inputElem, labelElem.nextSibling);
            divElem.insertBefore(labelElem, divElem.nextSibling);
            a++;
            }
            windowDataElement.append(divElem);
        }
        return windowDataElement;
    }

    /**
     * Adds rotated day elements to screen.
     */
    function datesBlock() {
        d = dateView.config.days;
        m = dateView.config.month;
        for (var v = 1; v <= d; v++) {
            dateLabelsElement.append("<span class='block'><span class='rotate'>2013-"+m+"-"+v+"</span></span>");
        }
    }

    /**
     * Converts json data to visible bars on screen.
     * @param {Object} jd holds all dates, from to and name.
     * @private
     */
    function datesToBars(jd) {
        var sing = dateView.config.blockWidth;            
        windowDisplayElement.html("");
        windowDisplayElement.append(dateLabelsElement);
        // Loop through all date ranges
        for (var g = 0; g <= jd.length-1; g++) {
            if (jd[g]['from']) {
                    from = parseInt(jd[g]['from'].slice(-2));
            }
            if (jd[g]['to']) {
                    to = parseInt(jd[g]['to'].slice(-2));
            }
            if (from && to) {
                dist = from - to;                
                startW = Math.abs((Math.abs(from)-1)*sing);
                endW = ((to)*sing) - startW;
                rangeInfo = {
                    "idNum": g.toString(),
                    "name": jd[g]['name'].replace(/ /g,"_"),
                    "start": startW,
                    "end": endW
                };
                fillRange(rangeInfo);
                
            }
        }
    }

    /**
     * Fills bars with correct color and information
     * @param {Object} rangeInfo holds id numerical reference to bar, name of the bar, starting and ending positions.
     * @private
     */
    function fillRange(rangeInfo) {
        var cln = "."+rangeInfo['name'],
            dre = dateRangesElement.clone(),
            wbe = windowBarElement.clone();
        currClass = wbe.attr('class')
        wbe
            .attr("class", currClass+rangeInfo['idNum'])
            .attr("id", currClass+rangeInfo['idNum'])
            .attr('ondrop','dateController.func.drop(event)')
            .attr('ondragover','dateController.func.enableDrop(event)');
        dre
            .addClass(rangeInfo['name'])
            .attr('id',rangeInfo['name']+"-"+rangeInfo['idNum'])
            .css('left',rangeInfo['start']+'px')
            .css('width',rangeInfo['end']+'px')
            .text(rangeInfo['name'].replace("_"," "))
            .attr('draggable','true')
            .attr('ondragstart', 'dateController.func.drag(event)');
        windowDisplayElement.append(
            wbe.append(
                dre
            )
        );
        jQuery(cln)
            .resizable({handles:'w,e'})
            .on('resize', function(e) {
                dateController.func.handleResizing(e,dateView.config)}
            );
    }

    /**
     * Updates bars after drag and drop action
     * @param {Object} e holds event information triggered by DnD event.
     * @param {Number} endPos holds ending position after DnD evevnt.
     * @param {String} barId holds string reference to bar
     * @param {Object} parentElement holds reference to where the element is being moved in.
     * @return {Object} with configuration information of dateView.
     * @private
     */
    function updateAfterDrop(e, endPos, barId, parentElement) {
        var elem = document.getElementById(barId),
            ref = jQuery("#"+barId);
        try {
            e.target.appendChild(elem);
        } catch (err) {}
        if ((endPos + parseInt(ref.css('width'))) <= dateView.config.monthWidth || endPos >= -1) ref.css('left', endPos);
        e.preventDefault();
        return dateView.config;
    }

    return {
        /**
         * Displays json data in input form elements.
         * @type {Function}
         */
        displayDatesRange: displayDatesRange,
        /**
         * Creates UI elements upon initialization.
         * @type {Function}
         */
        createUIElements: createUIElements,
        /**
         * Shows days in month and date ranges bars.
         * @type {Function}
         */
        datesBlock: datesBlock,
        /**
         * Converts json data to range bars.
         * @type {Function}
         */
        datesToBars: datesToBars,
        /**
         * Updates bars after drag and drop action.
         * @type {Function}
         */
        updateAfterDrop: updateAfterDrop
    };
}(dateView || {}, jQuery));