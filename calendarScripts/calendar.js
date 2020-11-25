//create calendar
var cal = new tui.Calendar('#calendar', {
  defaultView: 'week',
  taskView: false,
  borderColor: '#4aadff',
  dragBgColor: '#4aadff',
  isReadOnly: false,
  theme: {
    'common.holiday.color': '#bbb',
    'week.today.color': '#4aadff',
  },
  disableDblClick: true,
});

//FETCH REQUEST TO FILL CALENDAR HERE

cal.on('beforeCreateSchedule', function(event) {

  //unique id for schedules
  var timeID = parseInt((new Date().getTime() / 10).toString());

  //create schedule
  var newEvent = {
    id: timeID,
    calendarID: '1',
    title: 'Busy',
    category: 'time',
    start: event.start,
    end: event.end,
    bgColor: '#ff6961',
    dragBgColor: '#ff6961',
  };
  cal.createSchedules([newEvent]);

  //fetch to send new schedules to backend
  fetch("http://localhost:8080/api/v1/calendar/createAvailability", {
      method: 'POST',
      body: JSON.stringify(newEvent),
      headers: {
        'Origin': ' *',
        'Accept': 'application/json'
        //'Authorization': getCookie('access_token').toString();
      }
    })
    .then(function(response) {
      if (!response.ok) {
        response.json().then(function(object) {
          console.error('Error:', error);
        });
      }
      // else {
      //   cal.createSchedules([newEvent]);
      // }
      return response.json();
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

  //log the updated event
  console.log(event);

  //update the schedule
  cal.updateSchedule(schedule.id, schedule.calendarId, changes);
});

//click on a schedule to edit it
cal.on('clickSchedule', function(event) {

  //change view of page when editing
  document.getElementById("busyEditModal").style.display = "block";
  document.getElementById("logoutButton").style.display = "none";

  //set input field to current title of schedule
  document.getElementById("busyEditTitle").value = event.schedule.title;

  //function to create new event with the new name and delete the old one
  document.getElementById("editChangeTitle").onclick = function() {
    event.schedule.title = document.getElementById("busyEditTitle").value;

    //create new event with new name
    var newEvent = {
      id: event.id,
      calendarID: '1',
      title: document.getElementById("busyEditTitle").value,
      category: 'time',
      start: event.schedule.start,
      end: event.schedule.end,
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

//adds new event into the calendar
function addEvent(newEvent) {

  //unique id for the event,
  //uses the time it was since Jan 1, 1970
  var seconds = (new Date().getTime() / 10).toString();

  //create the schedule for the calendar
  cal.createSchedules([{
    id: seconds,
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
        'Accept': 'application/json'
        //'Authorization': getCookie('access_token').toString();
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
