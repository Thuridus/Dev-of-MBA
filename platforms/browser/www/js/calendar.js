var customCalendar = function(){
    this.kalenderJSON = [];
    var currentYear = new Date().getFullYear();
    // drei Jahre hinzufügen (Vorjahr, aktuelles Jahr und Folgejahr)
    for (h = -1; h <= 1; h++ ){
        var jahr = new jsonYahr(currentYear + h);
        for(i = 0; i < jsonSteuertabelle.length; i++){
            var monat = new jsonMonat(jsonSteuertabelle[i].monat);
            for (j = 0; j < jsonSteuertabelle[i].numberDays; j++){
                var tag = jsonTag();
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
    {"monat": "März", "numberDays": "31"},
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
function jsonTag(){
    return {"termine": []};
}
function jsonTermin(titel, ort){
    return {"number": "", "name": titel, "date": null, "ort": ort, "id": ""};
}