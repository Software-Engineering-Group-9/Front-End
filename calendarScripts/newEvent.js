function eventData(obj) {
  this.id = obj.id;
  this.title = obj.title;
  this.dueDate = obj.dueDate;
  this.startTime = obj.startTime;
  this.dueTime = obj.dueTime;
  this.timeNeeded = obj.timeNeeded;
}

function submitEvent() {
  //variables for event
  var title = document.getElementById("title").value;
  var dueDate = document.getElementById("dueDate").value;
  var dueTime = document.getElementById("dueTime").value;
  var timeNeeded = document.getElementById("timeNeeded").value;

  //create div to store event
  var toDoItem = document.createElement("div");

  //unique id for schedules
  var timeID = /* getCookie('uuid') +*/ new Date().getTime();

  //style div
  toDoItem.style.border = '.1vh';
  toDoItem.style.boxShadow = '0 .2vh .4vh 0 rgba(0, 0, 0, 0.2)';
  toDoItem.style.transition = '0.3s';
  toDoItem.style.width = '94%';
  toDoItem.style.padding = '3%';
  toDoItem.style.backgroundColor = 'white';
  toDoItem.style.borderRadius = '.8vh';
  toDoItem.style.marginTop = '.5vh';
  toDoItem.style.fontSize = '1.4vh';
  toDoItem.id = timeID;

  //required input
  if (title == "" || dueDate == "" || dueTime == "") {
    document.getElementById("requiredFieldText").style.display = "block"
    document.getElementById("requiredFieldText").innerHTML = "* indicates required input"
    return console.log("Error: Required InputField");
  }

  //calculate start time, format properly for calendar library
  var dueTimeArr = dueTime.split(':');

  var startTimeH = parseInt(dueTimeArr[0]);
  var startTimeM = parseInt(dueTimeArr[1]);

  var startTime;
  if (startTimeH == 0 && startTimeM < 30) {
    startTimeH = 0;
    startTimeM = 0;
  } else if (startTimeM < 30 && startTimeH != 0) {
    startTimeM += 30;
    startTimeH--;
  } else {
    startTimeM -= 30;
  }

  if (startTimeM < 10 && startTimeH < 10) {
    var startTime = '0' + startTimeH + ':0' + startTimeM;
  } else if (startTimeH < 10) {
    var startTime = '0' + startTimeH + ':' + startTimeM;
  } else if (startTimeM < 10) {
    var startTime = startTimeH + ':0' + startTimeM;
  } else if (startTimeH == 0 && startTimeM < 30) {
    startTime = '00:00';
  } else {
    var startTime = startTimeH + ':' + startTimeM;
  }

  //edit time format for calendar library
  var noon = "am"
  if (dueTimeArr[0] > 12) {
    dueTimeArr[0] -= 12;
    noon = "pm";
  }

  //variables and formatting of event list items
  var TitleString = title;
  if (timeNeeded != "") {
    TitleString += " - (" + timeNeeded + "h)"
  }

  var resString = dueDate + "   " + dueTimeArr[0] + ":" + dueTimeArr[1] + noon;
  toDoItem.innerHTML = "<b>" + TitleString +
    "</b><br> Due: " + resString;

  //create new event
  var newEvent = new eventData({
    id: timeID,
    title: title,
    dueDate: dueDate,
    startTime: startTime,
    dueTime: dueTime,
    timeNeeded: timeNeeded
  });

  //add item to list
  document.getElementById("eventSidebar").appendChild(toDoItem);

  //add event to calendar
  addEvent(newEvent);

  //log new event
  console.log(JSON.stringify(newEvent));

  //change view of page after adding event
  document.getElementById("eventModal").style.display = "none";
  document.getElementById("logoutButton").style.display = "block";
}
