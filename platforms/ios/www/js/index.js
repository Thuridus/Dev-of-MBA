/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


var $$ = Dom7;
var dataCalendar;
var preloader;

var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'CAS Planner',
  // App id
  id: 'www.famlovric.CAS_Planner',
  routes:[
    {   
      path: '/login/',
      url: 'index.html',
      keepAlive: true,
    },{   
      path: '/datapage/',
      url: 'datapage.html',
      keepAlive: true,
    },{
      path: '/units/',
      url: 'units.html',
      keepAlive: true,
    }
  ],
  touch: {
      fastClicks: true, 
      tapHold: true
  },
  // Enable swipe panel
  panel: {
    swipe: 'left',
  },
});

/*  Element-Definition
    
    Data Kalendar
    Main View
    Navigation Bar Tooltop mit Hinweistext
    Toast no Calendar selected

*/
var dataCalendar = new DataCalendar();
var mainView = app.views.create('.view-main');
var navbarTooltip = app.tooltip.create({
  targetEl: '.navbar-tooltip',
  text: 'Verwenden Sie Ihre<br>CAS-Zugangsdaten<br>um die Funktionen der<br>App zu verwenden'
});
var toastNoCalendar = app.toast.create({
  text: 'Es wurde kein Kalender f&uuml;r den Abgleich ausgew&auml;hlt.',
  closeButton: true,
});

// Call first Page init()
initHomepage();


$$(document).on('page:init', '.page[data-name="datapage"]', initDatapage);
$$(document).on('page:init', '.page[data-name="login"]', initHomepage);
$$(document).on('page:init', '.page[data-name="units"]', initUnitpage);


toastNoCalendar.on("close", function(){
  app.views.get('.view-main').router.navigate('/units/');
});

document.addEventListener("backbutton", function(){
  if(!preloader.closed){
    preloader.close();
  }
  app.views.get('.view-main').router.back();
  //window.setTimeout(() => window.stop(), 2000);
}, false);


function initHomepage(){
  $$('.convert-form-to-data').on('click', function(){
    var formData = app.form.convertToData('#Anmelde_Form');
    console.log(formData);
    // Da die Einbindung von Shiboleth nicht vorgesehen ist wird die Anmeldung immer akzeotiert.
    app.views.get('.view-main').router.navigate('/datapage/');
  });
}

function initDatapage(){
  // TODO Querladen der restlichen Daten aus einem JSON
  listCalendars();
}

function listCalendars(){
  var container = document.getElementById("acc-content3");
  if(window.plugins.calendar != null && (device.platform == "iOS" || device.platform == "Android")){
    container.innerHTML = ("<p>Lade ger&auml;teinterne Kalender...</p>");
    var liste = document.createElement("ul");
    window.plugins.calendar.listCalendars(function(message){
      for(var i in message){
          var element = document.createElement("li");
          element.innerHTML = getCalendarElement(message[i].id, message[i].name);
          liste.appendChild(element);
      }
      container.innerHTML = "";
      container.appendChild(liste);   
    },function(message){
      container.innerHTML = "Interne Kalender konnten nicht ermittelt werden";
    });
  }else{i
    container.innerHTML = "Diese native Funktion kann nur auf Android und iOS Endgeräten ausgeführt werden";
  }
}

function dataPageContinue(){
  var checkboxes = document.getElementsByName("calendarCheckbox");
  preloader = app.dialog.preloader("Lade Kalenderdaten")
  var calendarIDs = [];
  for(var i = 0; i < checkboxes.length; i++){
    if(checkboxes[i].checked){
      calendarIDs.push(checkboxes[i].value);
    }
  }
  // Wenn Kalender ausgewählt wurden sollen diese ausgelesen werden. Sonst wird nur des Toast geöffnet
  if(calendarIDs.length == 0){
    preloader.close();
    toastNoCalendar.open();
  }else{
    // Unterscheidung der Systme
    switch(device.platform){
      case "iOS":
        getPrivateCalendarDataApple(null, calendarIDs);
        break;
      case "Android":
        getPrivateCalendarDataAndroid(calendarIDs);
        break;
      default: 
        alert(`Cordova Kalender Plugin unterstüzt die Plattform ${device.platform} nicht`);
    }
  }
}

/***********************************************************************************************************************
           Calendar Functions
 ************************************************************************************************************************/ 
//#region
 
function getPrivateCalendarDataApple(message, calendarID){
  if(message != null){
    handleMessageObjectApple(message);
  }
  if(calendarID.length > 0){
    window.plugins.calendar.findAllEventsInNamedCalendar(calendarID.shift(), (message) => getPrivateCalendarDataApple(message, calendarID), (message) => console.error("Error"));
  }else{
    preloader.close();
    app.views.get('.view-main').router.navigate('/units/');
  }
}

function getPrivateCalendarDataAndroid(calendarIDs){
  var startDate = timeMachine(new Date(),-1,0,0);
  var endDate = timeMachine(new Date(),1,0,0);
  window.plugins.calendar.listEventsInRange(startDate, endDate, (message) => handleMessageObjectAndroid(message, calendarIDs), (message) => console.error("Error:" + message))
}

function handleMessageObjectApple(message){
  for (i in message){
    var event = new jsonEvent();
    event.title = message[i].title;
    event.start = new Date(message[i].startDate.replace(/-/g, "/"));
    event.end = new Date(message[i].endDate.replace(/-/g, "/"));
    event.location = message[i].location;
    dataCalendar.addElementToFikitvCalendar(dayCountOnEvent(event));
  }
}

function handleMessageObjectAndroid(message, calendarIDs){
  for(i in message){
    if(calendarIDs.includes(message[i].calendar_id)){
      var event = new jsonEvent();
      event.title = message[i].title;
      event.start = new Date(message[i].dtstart);
      event.end = new Date(message[i].dtend);
      event.location = message[i].eventLocation;
      dataCalendar.addElementToFikitvCalendar(dayCountOnEvent(event));
    }
  }
  if(!preloader.closed) preloader.close();
  app.views.get('.view-main').router.navigate('/units/');
}

function dayCountOnEvent(event){
  var startDate = new Date(event.start.getFullYear(), event.start.getMonth(), event.start.getDate());
  var endDate = new Date(event.end.getFullYear(), event.end.getMonth(), event.end.getDate());
  do{
    event.days.push(new Date(startDate));
    startDate.setDate(startDate.getDate() + 1);
  }while((endDate - startDate) >= 0);
  return event;
}
//#endregion

/***********************************************************************************************************************
           Dynamic Unit Page
 ************************************************************************************************************************/
//#region 

function initUnitpage(){
// Schleife über alle Vorlesungseinheiten im JSON-Array
  for(count in dualisOutput){
// Anzahl der Unterelemente prüfen
    if(dualisOutput[count].units.length > 1){
      // Wenn mehr als ein SubElement vorhanden sind sollen diese jeweils angezeigt werden 
      createUnitElementWithSubelements(dualisOutput[count], count);
    }else{
      // Wenn nur ein SubElement verfügbar ist soll kein Unterelement erstellt werden
      createUnitElement(dualisOutput[count], count);
    }
  }
  addCustomChangeListener();
}

function createUnitElementWithSubelements(vorlesung, elementNumber){
  var unitNumber = vorlesung.number;
// TopElement erstellen
  var newUnit = document.createElement("li");
  newUnit.appendChild(createTopLevelCheckbox(elementNumber, unitNumber, vorlesung.name));
// Container für Unterelemente 
  var subUnit = document.createElement("ul");
// Schleife über alle Unterelemente
  for(count in vorlesung.units){
    subUnit.appendChild(createSubLevelCheckbox(elementNumber, count, unitNumber, vorlesung.units[count].unitname));
  }
//Container zum TopElement hinzufügen
  newUnit.appendChild(subUnit);
// TopElement zur Liste hinzufügen
  var unitContainer = document.getElementById("listUnits");
  unitContainer.appendChild(newUnit);
}

function createUnitElement(vorlesung, elementNumber){
  var unitNumber = vorlesung.number;
// TopElement erstellen
  var newUnit = document.createElement("li");
  newUnit.appendChild(createTopLevelCheckbox(elementNumber, unitNumber, vorlesung.name));
// TopElement zur Liste hinzufügen
  var unitContainer = document.getElementById("listUnits");
  unitContainer.appendChild(newUnit);
}


//#endregion