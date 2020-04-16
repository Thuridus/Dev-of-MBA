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

function getReturnElement(object, value){
    for(counter in object){
        if(object[counter].id == value){
            return object[counter];
        }
    }
    return null;
}

function insertPrivateCalendarData(){
    var calendarCheckbox = document.getElementsByName("calendarCheckbox");
    
}
