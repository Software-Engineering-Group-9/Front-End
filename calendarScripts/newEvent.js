function eventData(obj) {
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

  //required input
  if (title == "" || dueDate === "" || dueTime === "") {
    document.getElementById("requiredFieldText").style.display = "block"
    document.getElementById("requiredFieldText").innerHTML = "* indicates required input"
    return console.log("Error: Required InputField");
  }

  //calculate start time, format properly for calendar library
  var dueTimeArr = dueTime.split(':');
  var startTime = parseInt(dueTimeArr[0] - timeNeeded);
  if (startTime < 10) {
    var startTime = '0' + (parseInt(dueTimeArr[0]) - timeNeeded).toString() + ':' + dueTimeArr[1];
  } else {
    var startTime = (parseInt(dueTimeArr[0]) - timeNeeded).toString() + ':' + dueTimeArr[1];
  }

  //edit time format for calendar library
  var noon = "am"
  if (dueTimeArr[0] > 12) {
    dueTimeArr[0] -= 12;
    noon = "pm";
  }

  //create div to store event
  var toDoItem = document.createElement("div", {
    "id": "toDoItem",
    "class": "toDoItem"
  });

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
  //add item to list
  document.getElementById("eventSidebar").appendChild(toDoItem);

  //create new event
  var newEvent = new eventData({
    title: title,
    dueDate: dueDate,
    startTime: startTime,
    dueTime: dueTime,
    timeNeeded: timeNeeded
  });

  //variables and formatting of event list items
  var TitleString = title;
  if (timeNeeded != "") {
    TitleString += " - (" + timeNeeded + "h)"
  }
  var resString = dueDate + "   " + dueTimeArr[0] + ":" + dueTimeArr[1] + noon;
  toDoItem.innerHTML = "<b>" + TitleString +
    "</b><br> Due: " + resString;

  //add event to calendar
  addEvent(newEvent);

  //log new event
  console.log(newEvent);

  //change view of page after adding event
  document.getElementById("eventModal").style.display = "none";
  document.getElementById("logoutButton").style.display = "block";
}
