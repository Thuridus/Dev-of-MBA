var DataCalendar = function(){
    this.kalenderJSON = [];
    this.terminArray = [];
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
    this.insertDataIntoDataCalendar();
}

var jsonSteuertabelle = [
    {"monat": "Januar", "numberDays": "31"},
    {"monat": "Februar", "numberDays": "29"},
    {"monat": "Maerz", "numberDays": "31"},
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



/***********************************************************************************************************************
 * Methoden
 ************************************************************************************************************************/
DataCalendar.prototype.insertDataIntoDataCalendar = function(){
    // Es werden jeweils die SubElemente in die beiden JSONs eingetragen
    // Wichtig ist dass sich die Objekte jeweils referenzieren
    for(i in dualisOutput){
        for(j in dualisOutput[i].units){
        // Neues Objekt erstellen
        var unit = new jsonUnit(i,j);
        // SubElement für einfachere Verarbeitung in eine separate Variable schreiben
        var element = dualisOutput[i].units[j];
        // Nummer des TopElements zuordnen
        unit.number = dualisOutput[i].number;
        // Name des SubElements zuordnen
        unit.name = element.unitname;
        // Für jedes Event ein Unterobjekt mit den Parametern Datum und Ort erstellen
        for (var date in element.events){
            unit.events.push(element.events[date]);
        }
        // Element einmal zum Terminarray Eintragen und zusätzlich pro Event in den Kalender
        this.terminArray.push(unit);
        this.addUnitToFikitvCalendar(unit);
        }
    }
}
DataCalendar.prototype.addTerminToFikitvCalendar = function(event){
    for(i in event.days){
        var date = new Date(event.days[i]);
        var tag = returnElement(this.kalenderJSON, date.getFullYear());
        if(tag != null){
            tag = tag.monate[date.getMonth()].tage[date.getDate() -1];
            tag.termine.push(event);
        }
    }
}
DataCalendar.prototype.addUnitToFikitvCalendar = function(unit){
    for(index in unit.events){
        var date = new Date(unit.events[index]);
        var tag = returnElement(this.kalenderJSON, date.getFullYear());
        if(tag != null){
            tag = tag.monate[date.getMonth()].tage[date.getDate() -1];
            tag.termine.push(unit);
        }
    }
}
DataCalendar.prototype.checkForConflicts = function(){
    // Prüfen aller Termine im Terminarray
    for (var index in this.terminArray){
        var conflictState = false;
        // Wenn der Status true ist also die Vorlesung ausgewählt wurde soll weiter geprüft werden
        if(this.terminArray[index].state){
            // Prüfung für jeden Tag im Termin
            for (var date in this.terminArray[index].events){
                // Wenn mehr als ein Termin aktiv ist soll der Status auf 
                if(this.checkAktiveEvents(this.terminArray[index].events[date]) > 1){
                    conflictState = true;
                }
            }
        }
        // bei true werden die Kennzeichen hinzugefügt sonst werden sie entfernt
        markUnitAsConflict(this.terminArray[index], conflictState);
    }
}
DataCalendar.prototype.checkAktiveEvents = function(date){
    var activeEvent = 0;
    var date = new Date(date);
    // Über Yahr --> Monat --> Tag den relevanten Container selektieren
    var tag = returnElement(this.kalenderJSON, date.getFullYear());
    if(tag != null){
        tag = tag.monate[date.getMonth()].tage[date.getDate() -1];
        // Prüfung aller Termine an diesem Tag --> Wenn state = true den Zähler um eins erhöhen 
        for(var eintrag in tag.termine){
            if(tag.termine[eintrag].state == true){
                activeEvent = ++activeEvent;
            }
        }
    }
    // Zähler zurückgegeben
    return activeEvent;
}
DataCalendar.prototype.getTagElement = function(date){
    date = new Date(date);
    var tag = returnElement(this.kalenderJSON, date.getFullYear());
    if(tag != null){
        tag = tag.monate[date.getMonth()].tage[date.getDate() -1];
    }
    return tag;
}