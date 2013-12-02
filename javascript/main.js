var main = {
    "datesSection": $('#window-data')
}

main.onLoad = function () {
    dateController.func.initData()
    jsonData = dateController.func.loadJSON();
    
    dateController.func.dataToInput(jsonData);
    dateController.func.dataToLabels(jsonData);
    
}

main.log = function (text) {
    console.log(text);    
}