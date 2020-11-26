//change view of page when buttons are pressed
function openEventForm() {
  document.getElementById("eventModal").style.display = "block";
  document.getElementById("logoutButton").style.display = "none";
}

function closeEventForm() {
  //reset input fields to blank
  document.getElementById("title").value = "";
  document.getElementById("dueDate").value = "";
  document.getElementById("dueTime").value = "";
  document.getElementById("timeNeeded").value = "";

  document.getElementById("eventModal").style.display = "none";
  document.getElementById("logoutButton").style.display = "block";
  document.getElementById("requiredFieldText").style.display = "none";
}

function closeEditEventForm() {
  //reset input fields to blank
  document.getElementById("editTitle").value = "";
  document.getElementById("editDueDate").value = "";
  document.getElementById("editDueTime").value = "";
  document.getElementById("editTimeNeeded").value = "";

  //change view of page
  document.getElementById("editToDoItemModal").style.display = "none";
  document.getElementById("logoutButton").style.display = "block";
  document.getElementById("requiredFieldTextEdit").style.display = "none";
}
