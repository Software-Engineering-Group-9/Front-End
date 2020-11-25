function registerData(obj) {
  this.email = obj.email;
  this.password = obj.password;
}

function register(){
  //register vars
  var email = document.getElementById("emailReg").value;
  var password = document.getElementById("passwordReg").value;

  //check for proper email
  if (/^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/.test(email)) {
    alert("valid email");

    //store register info
    var register = new registerData({
      email: email,
      password: password
    });

    //log register info
    console.log(register);

    //register fetch
    fetch("http://localhost:8080/api/v1/user/register", {
        method: 'POST',
        body: JSON.stringify(register),
        headers: {
          'Origin': ' *',
          'Accept': 'application/json'
        }
      })
      .then(function(response) {
        if (!response.ok) {
          response.json().then(function(object) {
            document.getElementById("loginInvalidEmail").innerHTML = object.message;
          });
        }
        return response.json();
      })
      .then(function(data) {
        document.cookie = 'access_token=' + data.token;
        location.replace("Calendar.html")
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    //change view of page after registering
    document.getElementById("registerModal").style.display = "none";
    document.getElementById("loginModal").style.display = "block";

  } else {
    //send on screen message if invalid email
    document.getElementById("registerInvalidEmail").innerHTML = "Enter a valid email";
  }
};
