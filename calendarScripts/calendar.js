var busyColour = '#ff6961';
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

//FETCH REQUEST TO FILL CALENDAR HERE

cal.on('beforeCreateSchedule', function(event) {

  //unique id for schedules
  //TO-DO COMBINE TIMEID WITH UUID
  //
  var timeID = new Date().getTime();

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
  cal.createSchedules([newBusyEvent]);
  console.log(timeID);

  //fetch to send new schedules to backend
  // fetch("http://localhost:8080/api/v1/calendar/createAvailability", {
  //     method: 'POST',
  //     body: JSON.stringify(newBusyEvent),
  //     headers: {
  //       'Origin': ' *',
  //       'Accept': 'application/json',
  //       'authorization': getCookie('access_token')
  //     }
  //   })
  //   .then(function(response) {
  //     if (!response.ok) {
  //       response.json().then(function(object) {
  //         console.error('Error:', error);
  //       });
  //     }
  //     // else {
  //     //   cal.createSchedules([newBusyEvent]);
  //     // }
  //     return response.json();
  //   })
  //   .catch((error) => {
  //     console.error('Error:', error);
  //   });
});

//event for when a schedule is dragged around or lengthened/shortened
cal.on('beforeUpdateSchedule', function(event) {
  //vars for update
  var schedule = event.schedule;
  var changes = event.changes;

  if (event.schedule.bgColor == '#4aadff') return;

  //log the updated event
  console.log(event);

  //update the schedule
  schedule.calendarId = '1';
  console.log("update:" + schedule.id + " calendarID: " + schedule.calendarId);
  cal.updateSchedule(schedule.id, schedule.calendarId, changes);
});

//click on a schedule to edit it
cal.on('clickSchedule', function(event) {

  //function to create new event with the new name and delete the old one
  document.getElementById("editChangeTitle").onclick = function() {
    event.schedule.title = document.getElementById("busyEditTitle").value;

    //create new event with new name
    var newEvent = {
      id: event.id,
      calendarID: '1',
      title: document.getElementById("busyEditTitle").value,
      category: 'time',
      start: formatTime(event.schedule.start._date),
      end: formatTime(event.schedule.end._date),
      bgColor: event.schedule.bgColor,
      dragBgColor: event.schedule.dragBgColor,
    };
    cal.createSchedules([newEvent]);
    //delete old one
    cal.deleteSchedule(event.schedule.id, event.schedule.calendarId);

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

  if (event.schedule.bgColor == '#4aadff') {
    //change view of page
    document.getElementById("editToDoItemModal").style.display = "block";
    document.getElementById("logoutButton").style.display = "none";

    document.getElementById("submitEditEvent").onclick = function() {

      console.log("submitted");

      //new fields
      var title = document.getElementById("editTitle").value;
      var dueDate = document.getElementById("editDueDate").value;
      var dueTime = document.getElementById("editDueTime").value;
      var timeNeeded = document.getElementById("editTimeNeeded").value;

      //required input
      if (title == "" || dueDate === "" || dueTime === "") {
        document.getElementById("requiredFieldTextEdit").style.display = "block"
        document.getElementById("requiredFieldTextEdit").innerHTML = "* indicates required input"
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
        console.log("startTime 1: " + '0' + startTimeH + ':0' + startTimeM);
      } else if (startTimeH < 10) {
        var startTime = '0' + startTimeH + ':' + startTimeM;
        console.log("startTime 2: " + '0' + startTimeH + ':' + startTimeM);
      } else if (startTimeM < 10) {
        var startTime = startTimeH + ':0' + startTimeM;
        console.log("startTime 3: " + startTimeH + ':0' + startTimeM);
      } else if (startTimeH == 0 && startTimeM < 30) {
        startTime = '00:00';
      } else {
        var startTime = startTimeH + ':' + startTimeM;
        console.log("startTime 4: " + startTimeH + ':' + startTimeM);
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

      //update toDoItem text
      document.getElementById(event.schedule.id).innerHTML = "<b>" + TitleString + "</b><br> Due: " + resString;

      closeEditEventForm();

      cal.updateSchedule(event.schedule.id, event.schedule.calendarId, {
        title: title,
        start: dueDate + 'T' + startTime + ':00',
        end: dueDate + 'T' + dueTime + ':00',
      });
    }

  } else if (event.schedule.bgColor == busyColour) {
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
  var month = getMonthNum(eventTimeArr[1]).toString();
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
    monthNum = 01;
  } else if (month == 'Feb') {
    monthNum = 02;
  } else if (month == 'Mar') {
    monthNum = 03;
  } else if (month == 'Apr') {
    monthNum = 04;
  } else if (month == 'May') {
    monthNum = 05;
  } else if (month == 'Jun') {
    monthNum = 06;
  } else if (month == 'Jul') {
    monthNum = 07;
  } else if (month == 'Aug') {
    monthNum = 08;
  } else if (month == 'Sep') {
    monthNum = 09;
  } else if (month == 'Oct') {
    monthNum = 10;
  } else if (month == 'Nov') {
    monthNum = 11;
  } else if (month == 'Dec') {
    monthNum = 12;
  }

  return monthNum;
}

//adds new event into the calendar
function addEvent(newEvent) {

  //create the schedule for the calendar
  cal.createSchedules([{
    id: newEvent.id,
    calendarID: '1',
    title: newEvent.title,
    category: 'time',
    dueDateClass: '',
    start: newEvent.dueDate + 'T' + newEvent.startTime + ':00',
    end: newEvent.dueDate + 'T' + newEvent.dueTime + ':00',
    bgColor: '#4aadff',
    dragBgColor: '#4aadff',
  }]);

  //reset the fields of the createEvent form to blank
  document.getElementById("title").value = "";
  document.getElementById("dueDate").value = "";
  document.getElementById("dueTime").value = "";
  document.getElementById("timeNeeded").value = "";

  //fetch to send the newly created event to the backend
  fetch("http://localhost:8080/api/v1/calendar/create", {
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
          document.getElementById("loginInvalidEmail").innerHTML = object.message;
        });
      }
      // else {
      //   cal.createSchedules([{
      //     id: seconds,
      //     calendarID: '1',
      //     title: newEvent.title,
      //     category: 'time',
      //     dueDateClass: '',
      //     start: newEvent.dueDate + 'T' + newEvent.startTime + ':00',
      //     end: newEvent.dueDate + 'T' + newEvent.dueTime + ':00',
      //     bgColor: '#4aadff',
      //     dragBgColor: '#4aadff',
      //   }]);
      // }
      return response.json();
    })
    .catch((error) => {
      console.error('Error:', error);
    });

}
