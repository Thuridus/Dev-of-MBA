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
var kalenderJSON = [];

var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'CAS Planner',
  // App id
  id: 'www.famlovric.CAS_Planner',
  routes:[
    {   
        path: '/calendar/',
        url: 'calendar.html',
    },{
        path: '/units/',
        url: 'units.html',
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
    
    Main View
    Navigation Bar Tooltop mit Hinweistext

*/
var mainView = app.views.create('.view-main');
var navbarTooltip = app.tooltip.create({
  targetEl: '.navbar-tooltip',
  text: 'Verwenden Sie Ihre<br>CAS-Zugangsdaten<br>um die Funktionen der<br>App zu verwenden'
});

/*  Page INITS
    
    INIT für Datenseite

*/
$$(document).on('page:init', '.page[data-name="Calendar"]', fillDataPage);


/*

Eventlistener für den Button auf der Loginseite

*/
$$('.convert-form-to-data').on('click', function(){
  var formData = app.form.convertToData('#Anmelde_Form');
  console.log(formData);
  // Da die Einbindung von Shiboleth nicht vorgesehen ist wird die Anmeldung immer akzeotiert.
  app.views.get('.view-main').router.navigate('/Calendar/');
});

/*

Eventlistener für Zurückbutton (z.B. Android Geräte)

*/
document.addEventListener("backbutton", function(){
  app.views.get('.view-main').router.back();
}, false);






function fillDataPage(){
  // TODO Querladen der restlichen Daten aus einem JSON
  loadCalendar();
}

function loadCalendar(){
  if(window.plugins.calendar != null){
    var container = document.getElementById("acc-content3")
    container.innerHTML = ("<p>Lade ger&auml;teinterne Kalender...</p>")
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
      container.innerHTML = "Kalender konnten nicht ausgelesen werden";
    });
  }else{
      alert("Diese native Funktion kann nur in einer installierten Anwendung ausgeführt werden");
  }
}



