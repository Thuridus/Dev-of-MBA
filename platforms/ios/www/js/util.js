function returnElement(object, value){
    for(counter in object){
        if(object[counter].id == value){
            return object[counter];
        }
    }
    return null;
}

function timeMachine(date, year, month, day){
    date.setFullYear(date.getFullYear() + year);
    date.setMonth(date.getMonth() + month);
    date.setDate(date.getDate() + day);
    return new Date(date);
}

function jsonEvent(){
    return {"title": "", "start": "", "end": "", "location": "", "days": []};
}

/***********************************************************************************************************************
           OBJECTS
 ************************************************************************************************************************/
function getCalendarElement(id, name){
    return `
    <label class="item-checkbox item-content">
        <input type="checkbox" name="calendarCheckbox" value="${id}"/>
        <i class="icon icon-checkbox"></i>
        <div class="item-inner">
            <div class="item-title">${name}</div>
        </div>
    </label>`;
}
function createTopLevelCheckbox(topIndex, number, name){
    var element = document.createElement("label");
    element.setAttribute("class", "item-checkbox item-content")
    element.innerHTML =  `
        <input type="checkbox" name="checkboxUnit_${topIndex}" data-id="unit" data-level="TOP" value="${topIndex}"/>
        <i class="icon icon-checkbox"></i>
        <div class="item-inner">
            <div class="item-title-row">
                <div class="item-title">${number}</div>
            </div>    
            <div class="item-subtitle">${name}</div>
        </div>`;
    return element;
}
function createSubLevelCheckbox(topIndex, subIndex, number, name){
    var element = document.createElement("li");
    element.innerHTML = `
        <label class="item-checkbox item-content">
            <input type="checkbox" name="sub_checkboxUnit_${topIndex}" data-id="unit" data-level="SUB" value="${topIndex}_${subIndex}"/>
            <i class="icon icon-checkbox"></i>
            <div class="item-inner">
                <div class="item-title-row">
                    <div class="item-title">${number}</div>
                </div>    
                <div class="item-subtitle">${name}</div>
            </div>
        </label>`;
    return element;
}

function addCustomChangeListener(){
    $$('[data-level="TOP"]').on('change', function (e){
        console.log(e.target);
        if(e.target.checked){
            $$('[name="sub_' + e.target.name + '"]').prop('checked', true);
        }else{
            $$('[name="sub_' + e.target.name + '"]').prop('checked', false);
        }
    });

    $$('[data-level="SUB"]').on('change', function (e){
        var totalUnitSubElements = $$('[name="' + e.target.name + '"]').length;
        var totalCheckedUnitSubElements = $$('[name="' + e.target.name + '"]:checked').length;
        var topElementName = e.target.name.replace("sub_", "");
        // Wenn kein Subelement ausgewählt ist wird das Top element auch deselektiert
        if(totalCheckedUnitSubElements === 0){
            $$('[name="' + topElementName + '"]').prop('checked', false);
        }else if(totalCheckedUnitSubElements === totalUnitSubElements){
            $$('[name="' + topElementName + '"]').prop('checked', true);
        }
        // Für alle Werte dazwischen wird eine neue IF-Abfrage aufgebaut
        if(totalCheckedUnitSubElements > 0 && totalCheckedUnitSubElements < totalUnitSubElements){
            $$('[name="' + topElementName + '"]').prop('indeterminate', true);
        }else{
            $$('[name="' + topElementName + '"]').prop('indeterminate', false);
        }
    });
}
