var dateController = dateController || {};

dateController.func = (function ($) {
    var newSection,
        jsonData;

    function initData() {
        dateView.func.createUIElements();
        dateView.func.datesBlock();        
    }

    function loadJSON() {
        jsonData = dateLoad.func.loadJSON();
        return jsonData;
    }

    function dataToInput(jsonData) {
        main.log('[dateController.dataToInput] Setting json data to input forms...');
        newSection = dateView.func.displayDateRanges(jsonData);
        dateView.func.updateDatesRange();
        return newSection;
    }
    
    map = {
        "0": "name",
        "1": "from",
        "2": "to"
    }

    function dataChange(e,a,g) {
        if (map[a]) {
            jsonData[g][map[a]] = e.value;
        }
        dataToLabels(jsonData);
    }

    function dataToLabels(jsonData) {
        dateView.func.dateRanges(jsonData);
    }

    return {
        initData:initData,
        loadJSON: loadJSON,
        dataToInput: dataToInput,
        dataToLabels: dataToLabels,
        dataChange: dataChange
    };
}(dateController || {}, jQuery));


