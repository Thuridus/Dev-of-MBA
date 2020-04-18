var DataCalendar = function(){
    this.kalenderJSON = [];
    this.terminarray = [];
    var currentYear = new Date().getFullYear();
    // drei Jahre hinzufügen (Vorjahr, aktuelles Jahr und Folgejahr)
    for (h = -1; h <= 1; h++ ){
        var jahr = new jsonYahr(currentYear + h);
        for(i = 0; i < jsonSteuertabelle.length; i++){
            var monat = new jsonMonat(jsonSteuertabelle[i].monat);
            for (j = 1; j <= jsonSteuertabelle[i].numberDays; j++){
                var tag = jsonTag(j);
                monat.tage.push(tag);
            }
            jahr.monate.push(monat);
        }
        this.kalenderJSON.push(jahr);
    }
}

var jsonSteuertabelle = [
    {"monat": "Januar", "numberDays": "31"},
    {"monat": "Februar", "numberDays": "29"},
    {"monat": "M&aumlrz", "numberDays": "31"},
    {"monat": "April", "numberDays": "30"},
    {"monat": "Mai", "numberDays": "31"},
    {"monat": "Juni", "numberDays": "30"},
    {"monat": "Juli", "numberDays": "31"},
    {"monat": "August", "numberDays": "31"},
    {"monat": "September", "numberDays": "30"},
    {"monat": "Oktober", "numberDays": "31"},
    {"monat": "November", "numberDays": "30"},
    {"monat": "Dezember", "numberDays": "31"}  
];

function jsonYahr(jahr){
    return {"id":jahr, "monate": []}; 
}
function jsonMonat(monat){
    return {"id":monat, "tage": []}; 
}
function jsonTag(tag){
    return {"id": tag,"termine": []};
}

/***********************************************************************************************************************
 * Methoden
 ************************************************************************************************************************/
DataCalendar.prototype.addElementToFikitvCalendar = function(event){
    for(i in event.days){
        var date = new Date(event.days[i]);
        var tag = returnElement(this.kalenderJSON, date.getFullYear());
        if(tag != null){
            tag = tag.monate[date.getMonth()].tage[date.getDate() -1];
            tag.termine.push(event);
        }
    }
}

