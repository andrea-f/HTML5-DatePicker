var dateView = dateView || {};

dateView.config = dateView.config || {};

dateView.config = {
    "days": 30,
    "month" : 11,
    "blockWidth": 40    
}

dateView.func = (function ($) {

    var windowDataElement = jQuery("<section id='window-data'></section>"),
        addWindowElement = jQuery("<button id='add-window' onclick='dateView.func.addWindow()'>Add Window</button>"),
        windowDisplayElement = jQuery("<section id='window-display'></section>"),
        dateLabelsElement = jQuery("<div id='date-labels'></div>");

    function createUIElements() {
        jQuery('body').append(
            windowDataElement,
            addWindowElement,
            windowDisplayElement.append(dateLabelsElement)
        );
    }

    function addWindow() {
        windowDataElement.append(
            "<div><label>Name:<input value=''></label><label>From:<input type='date' value='' onkeyup='dateController.func.dataChange(this)'></label><label>To:<input type='date' value='' onkeyup='dateController.func.dataChange(this)'></label></div>"
        )
    }

    function capitalise(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function displayDateRanges(jsonData) {
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
                    inputElem.setAttribute("onkeyup", "dateController.func.dataChange(this,"+a+","+g+")");
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

    function updateDatesRange(sect) {
        datesSection = sect;
        return datesSection;
    }

    function datesBlock() {
        d = dateView.config.days;
        m = dateView.config.month;
        for (var v = 1; v <= d; v++) {
            dateLabelsElement.append("<span class='block'><span class='rotate'>2013-"+m+"-"+v+"</span></span>");
        }
    }

    function dateRanges(jd) {
        tot = dateView.config.days * dateView.config.blockWidth;
        sing = dateView.config.blockWidth;
        windowDisplayElement.html("");
        windowDisplayElement.append(dateLabelsElement);
        for (var g = 0; g <= jd.length; g++) {
            if (jd[g]['from']) {
                    from = parseInt(jd[g]['from'].slice(-2));
            }
            if (jd[g]['to']) {
                    to = parseInt(jd[g]['to'].slice(-2));
            }
            dist = from - to;
            startW = ((from-1)*sing);            
            endW = ((to)*sing) - startW;
            rangeInfo = {
                "id": g,
                "name": jd[g]['name'],
                "start": startW,
                "end": endW
            }
            divFill = fillRange(rangeInfo);
        }
    }

    function fillRange(rangeInfo) {
        windowDisplayElement.append("<div class='window-container'><span class='window' style='left:"+rangeInfo['start']+"px; width:"+rangeInfo['end']+"px'>"+rangeInfo['name']+"</span></div>");       
    }

    return {
        displayDateRanges: displayDateRanges,
        updateDatesRange: updateDatesRange,
        createUIElements: createUIElements,
        addWindow: addWindow,
        datesBlock: datesBlock,
        dateRanges: dateRanges
    };
}(dateView || {}, jQuery));