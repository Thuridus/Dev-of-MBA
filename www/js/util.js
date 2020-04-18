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

function returnElement(object, value){
    for(counter in object){
        if(object[counter].id == value){
            return object[counter];
        }
    }
    return null;
}

function getClearDate(dateString){
    var dateTime = dateString.split(" ");
    return dateTime[0];
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