function eventData(obj) {
  this.id = obj.id;
  this.title = obj.title;
  this.dueDate = obj.dueDate;
  this.startTime = obj.startTime;
  this.dueTime = obj.dueTime;
  this.timeNeeded = obj.timeNeeded;
}

function addTodo() {

  //variables for event
  var title = document.getElementById("title").value;
  var dueDate = document.getElementById("dueDate").value;
  var dueTime = document.getElementById("dueTime").value;
  var timeNeeded = document.getElementById("timeNeeded").value;

  //unique id for schedules
  var timeID = getCookie('uuid') + new Date().getTime();

  //create div to store event
  var toDoItem = document.createElement("div");
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

  //required input, time needed
  if (title == "" || dueDate == "" || dueTime == "" || !/([1-9]|[1-9][0-9]+)/.test(timeNeeded)) {
    document.getElementById("requiredFieldText").style.display = "block"
    document.getElementById("requiredFieldText").innerHTML = "* indicates required input"
    return console.log("Error: Required InputField");
  }

  //calculate start time, format properly for calendar library
  var dueTimeArr = dueTime.split(':');

  //edit time format for calendar library
  var noon = "am"
  if (dueTimeArr[0] > 12) {
    dueTimeArr[0] -= 12;
    noon = "pm";
  }

  //variables and formatting of event list items
  var TitleString = title + " - (" + timeNeeded + "h)"
  var resString = dueDate + "   " + dueTimeArr[0] + ":" + dueTimeArr[1] + noon;
  toDoItem.innerHTML = "<b>" + TitleString +
    "</b><br> Due: " + resString;

  //create new event
  var newEvent = new eventData({
    id: timeID,
    title: title,
    dueDate: dueDate,
    dueTime: dueTime,
    timeNeeded: timeNeeded
  });

  //reset the fields of the createEvent form to blank
  document.getElementById("title").value = "";
  document.getElementById("dueDate").value = "";
  document.getElementById("dueTime").value = "";
  document.getElementById("timeNeeded").value = "";

  //fetch to send the newly created event info to the backend
  fetch("http://localhost:8080/api/v1/calendar/createTodoEvent", {
      method: 'POST',
      body: JSON.stringify(newEvent),
      headers: {
        'Origin': ' *',
        'Accept': 'application/json',
        'authorization': getCookie('access_token')
      }
    })
    .then(function(response) {
      if (!response.ok) {
        response.json().then(function(object) {
        });
      } else {

        //add item to list
        document.getElementById("eventSidebar").appendChild(toDoItem);

      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  //log new event
  console.log(JSON.stringify(newEvent));

  //change view of page after adding event
  document.getElementById("eventModal").style.display = "none";
  document.getElementById("logoutButton").style.display = "block";
}
