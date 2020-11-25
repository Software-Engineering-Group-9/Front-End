//change view of page when buttons are pressed
function openEventForm() {
  document.getElementById("eventModal").style.display = "block";
  document.getElementById("logoutButton").style.display = "none";
}

function closeEventForm() {
  document.getElementById("eventModal").style.display = "none";
  document.getElementById("logoutButton").style.display = "block";
  document.getElementById("requiredFieldText").style.display = "none";
}
