function loginData(obj) {
  this.email = obj.email;
  this.password = obj.password;
}

function login() {

  //login vars
  var email = document.getElementById("emailLogin").value;
  var password = document.getElementById("passwordLogin").value;

  //temp login for devs
  if (email === "admin" && password === "password") {
    location.replace("Calendar.html")
  }

  //check for proper email
  if (/^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/.test(email)) {

    //store login info
    var login = new loginData({
      email: email,
      password: password
    });

    //log login info
    console.log(login);

    //login fetch
    fetch("http://localhost:8080/api/v1/user/login", {
        method: 'POST',
        body: JSON.stringify(login),
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
        return response.json();
      })
      .then(function(data) {
        document.cookie = 'access_token=' + data.token;
        location.replace("Calendar.html")
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }
};
