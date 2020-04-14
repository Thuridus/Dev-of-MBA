function getCalendarElement(id, name){
    return `
    <label class="item-checkbox item-content">
        <input type="checkbox" name="calendarCheckbox" value="${id}" checked="checked"/>
        <i class="icon icon-checkbox"></i>
        <div class="item-inner">
            <div class="item-title">${name}</div>
        </div>
    </label>`;
}
