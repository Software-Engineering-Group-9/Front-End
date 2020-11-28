datadatavar busyColour = '#ff6961';
var eventColour = '#4aadff';

//create calendar
var cal = new tui.Calendar('#calendar', {
  defaultView: 'week',
  taskView: false,
  borderColor: eventColour,
  dragBgColor: eventColour,
  isReadOnly: false,
  theme: {
    'common.holiday.color': '#bbb',
    'week.today.color': eventColour,
  },
  disableDblClick: true,
});

//fetch request to fill sidebar upon login
fetch("http://localhost:8080/api/v1/calendar/getTodoEvent", {
    method: 'GET',
    headers: {
      'authorization': getCookie('access_token')
    }
  })
  .then(function(response) {
    if (!response.ok) {
      response.json().then(function(object) {
        console.error('Error:', error);
      });
    }
    return response.json();
  })
  .then(function(data) {
    //create div
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

    for (var key in data) {

      var newToDoItem = {
        id: data[key].eid,
        title: data[key].title,
        dueDate: data[key].duedate,
        dueTime: data[key].duetime,
        timeNeeded: data[key].timeneed
      }

      var dueTimeArr = newToDoItem.dueTime.split(':');

      //edit time format for calendar library
      var noon = "am"
      if (dueTimeArr[0] > 12) {
        dueTimeArr[0] -= 12;
        noon = "pm";
      }

      //variables and formatting of event list items
      var TitleString = newToDoItem.title + " - (" + newToDoItem.timeNeeded + "h)"
      var resString = newToDoItem.dueDate + "   " + dueTimeArr[0] + ":" + dueTimeArr[1] + noon;
      toDoItem.innerHTML = "<b>" + TitleString +
        "</b><br> Due: " + resString;

      //add item to list
      document.getElementById("eventSidebar").appendChild(toDoItem);
    }

  })
  .catch((error) => {
    console.error('Error:', error);
  });

//fetch request to fill calendar upon login
fetch("http://localhost:8080/api/v1/calendar/getEvent", {
    method: 'GET',
    headers: {
      'authorization': getCookie('access_token')
    }
  })
  .then(function(response) {
    if (!response.ok) {
      response.json().then(function(object) {
        console.error('Error:', error);
      });
    }
    return response.json();
  })
  .then(function(data) {

    for (var key in data) {

      var newSchedule = {
        id: data[key].id,
        calendarid: '1',
        title: data[key].title,
        category: 'time',
        start: data[key].starttime,
        end: data[key].endtime,
        bgColor: data[key].color,
        dragBgColor: data[key].color
      }
      cal.createSchedules(newSchedule);
    }

  })
  .catch((error) => {
    console.error('Error:', error);
  });

cal.on('beforeCreateSchedule', function(event) {

  //unique id for schedules
  var timeID = getCookie('uuid') + new Date().getTime();

  //create schedule
  var newBusyEvent = {
    id: timeID,
    calendarID: '1',
    title: 'Busy',
    category: 'time',
    start: formatTime(event.start._date),
    end: formatTime(event.end._date),
    bgColor: busyColour,
    dragBgColor: busyColour,
  };

  //fetch to send new schedules to backend and create upon ok response
  fetch("http://localhost:8080/api/v1/calendar/createAvailability", {
      method: 'POST',
      body: JSON.stringify(newBusyEvent),
      headers: {
        'Origin': ' *',
        'Accept': 'application/json',
        'authorization': getCookie('access_token')
      }
    })
    .then(function(response) {
      if (!response.ok) {
        response.json().then(function(object) {
          console.log(object.errorText);
        });
      } else {
        cal.createSchedules([newBusyEvent]);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});

//event for when a schedule is dragged around or lengthened/shortened
cal.on('beforeUpdateSchedule', function(event) {
  //vars for update
  var schedule = event.schedule;
  var changes = event.changes;

  if (event.schedule.bgColor == '#4aadff') return;

  //update the schedule
  schedule.calendarId = '1';
  // DEBUGGING: console.log("update:" + schedule.id + " calendarID: " + schedule.calendarId);
  cal.updateSchedule(schedule.id, schedule.calendarId, changes);
});

//click on a schedule to edit it
cal.on('clickSchedule', function(event) {

  //function to create new event with the new name and delete the old one
  document.getElementById("editChangeTitle").onclick = function() {
    document.getElementById("busyEditTitle").value;

    //update busy schedule with new name
    cal.updateSchedule(event.schedule.id, event.schedule.calendarId, {
      title: document.getElementById("busyEditTitle").value
    });

    //change view of page after editing title
    document.getElementById("busyEditModal").style.display = "none";
    document.getElementById("logoutButton").style.display = "block";
  }

  //function to cancel editing current schedule,
  //changes view of page after cancelling
  document.getElementById("editCancel").onclick = function() {
    document.getElementById("busyEditModal").style.display = "none";
    document.getElementById("logoutButton").style.display = "block";
  }
  //deletes current schedule, changes view of page after deleting
  document.getElementById("editDeleteEvent").onclick = function() {
    cal.deleteSchedule(event.schedule.id, event.schedule.calendarId);
    document.getElementById("busyEditModal").style.display = "none";
    document.getElementById("logoutButton").style.display = "block";
  }

  if (event.schedule.bgColor == busyColour) {
    //change view of page when editing
    document.getElementById("busyEditModal").style.display = "block";
    document.getElementById("logoutButton").style.display = "none";

    //set input field to current title of schedule
    document.getElementById("busyEditTitle").value = event.schedule.title;
  }

});

//change calendar view to monthly
function monthView() {
  cal.changeView('month', true);
}

//change calendar view to weekly, weekly by default
function weekView() {
  cal.changeView('week', true);
}

//change calendar view to daily
function dayView() {
  cal.changeView('day', true);
}

//view next day/week/month
function viewNext() {
  cal.next();
}

//view previous day/week/month
function viewPrev() {
  cal.prev();
}

//formats tui event Date
function formatTime(_date) {
  var eventTime = _date.toString();
  eventTimeArr = eventTime.split(" ");
  var month = getMonthNum(eventTimeArr[1]);
  var day = (eventTimeArr[2]).toString();
  var year = (eventTimeArr[3]).toString();
  var time = (eventTimeArr[4]).toString();
  eventTime = year + "-" + month + "-" + day + "T" + time;
  return eventTime;
}

//takes in the month str and returns the number representation, Jan -> 1
function getMonthNum(month) {

  var monthNum;
  if (month == 'Jan') {
    monthNum = '01';
  } else if (month == 'Feb') {
    monthNum = '02';
  } else if (month == 'Mar') {
    monthNum = '03';
  } else if (month == 'Apr') {
    monthNum = '04';
  } else if (month == 'May') {
    monthNum = '05';
  } else if (month == 'Jun') {
    monthNum = '06';
  } else if (month == 'Jul') {
    monthNum = '07';
  } else if (month == 'Aug') {
    monthNum = '08';
  } else if (month == 'Sep') {
    monthNum = '09';
  } else if (month == 'Oct') {
    monthNum = '10';
  } else if (month == 'Nov') {
    monthNum = '11';
  } else if (month == 'Dec') {
    monthNum = '12';
  }

  return monthNum;
}

function calendarOptimize() {
  console.log("TIME TO OPTIMIZE");

  fetch("http://localhost:8080/api/v1/calendar/createAvailability", {
      method: 'GET',
      headers: {
        'authorization': getCookie('access_token')
      }
    })
    .then(function(response) {
      if (!response.ok) {
        response.json().then(function(object) {
          console.error('Error:', error);
        });
      }
      return response.json();
    })
    .then(function(data) {

      for (var key in data) {

        var newSchedule = {
          id: data[key].id,
          calendarID: '1',
          title: data[key].title,
          category: 'time',
          start: data[key].starttime,
          end: data[key].endtime,
          bgColor: data[key].color,
          dragBgColor: data[key].color
        }
        var cid = ""
        cal.deleteSchedule(id, cid);
        cal.createSchedules(newSchedule);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
