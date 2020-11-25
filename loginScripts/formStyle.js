//change view of page when buttons are pressed
function openForm() {
  document.getElementById("loginModal").style.display = "none";
  document.getElementById("registerModal").style.display = "block";
  document.getElementById("dev-text").style.display = "none";
}

function closeForm() {
  document.getElementById("registerModal").style.display = "none";
  document.getElementById("loginModal").style.display = "block";
  document.getElementById("dev-text").style.display = "block";
}
