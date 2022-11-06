/**
 * Handles the Sign-up and Log-in with users' input and API calls
 */

/****************************************************************
 ************************ SIGN - UP *****************************
 *****************************************************************/

/**
 * Check if two of the password the user entered match;
 * Throw error if not
 */

var apiLink = "https://api.thearmyofkindness.org/";

function passwordSanitize(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(
    password
  );
}

function numberSanitize(number) {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(
    number
  );
}

function conditionalRender() {
  if (window.localStorage.getItem("isLoggedIn") == "true") {
    hideLogin();
  } else {
    hideManageProfile();
  }
}

function displayAdminPage() {
  if (window.localStorage.getItem("isAdmin") == "true") {
    document.getElementById("admin-btn").style.display = "block";
  } else {
    document.getElementById("admin-btn").style.display = "none";
  }
}

function hideManageProfile() {
  document.getElementById("profile").style.display = "none";
  document.getElementById("login").style.display = "block";
  document.getElementById("signup").style.display = "block";
  displayAdminPage();
}

function hideLogin() {
  document.getElementById("login").style.display = "none";
  document.getElementById("signup").style.display = "none";
  document.getElementById("profile").style.display = "block";
  displayAdminPage();
}

function processForgotPassword() {
  var email = document.querySelector("#forgot-password-form input").value;
  // session intended for demo-purpose
  if (email !== "trandd@miamioh.edu") {
    document.getElementById("password-failed-1").style.display = "inline";
    document.getElementById("password-email-sent").style.display = "none";
  } else {
    document.getElementById("password-email-sent").style.display = "inline";
    document.getElementById("password-failed-1").style.display = "none";
  }
}

const invalid_token = '"00000000-0000-0000-0000-000000000000"';
/**
 * Determine if the current user has admin role by calling the API
 * If yes, show the Admin page -- do nothing otherwise
 */
function showAdmin() {
  // check if the user has logged in and has a valid token
  var token = window.localStorage.getItem("token").replaceAll('"', "");

  if (
    window.localStorage.getItem("isLoggedIn") == "true" &&
    token !== invalid_token
  ) {
    // make the API call
    var url = apiLink + "IsAdmin?token=" + token;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onload = () => {
      if (xhr.status == 200) {
        // process the response and determine if the user has Admin right
        // hard-code part begins
        if (xhr.response === "true") {
          localStorage.setItem("isAdmin", true);
        } else {
          localStorage.setItem("isAdmin", false);
        }
        window.onChange = conditionalRender();
      } else {
        // the call should not be exposed to the end-user as they don't directly
        // interact with it -- but we can somehow log the error if the call fails here
        // making tracing and debugging easier
        console.log("ReaderUserRole Call Failed - line 98");
      }
    };
  }
}

function processLogIn() {
  var data = new FormData();
  var inputs = document.querySelectorAll("#log-in-form input");

  for (let input of inputs) {
    data.append(input.name, input.value);
  }

  var url =
    apiLink +
    "CheckLogin?email=" +
    data.get("email") +
    "&password=" +
    data.get("password");
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.send();
  xhr.onload = () => {
    if (xhr.status == 200) {
      var token = xhr.response;
      if (token !== invalid_token) {
        localStorage.setItem("token", token);
        localStorage.setItem("isLoggedIn", true);
        document.getElementById("modalLoginForm").click();
        showAdmin();
        window.onChange = conditionalRender();
      } else {
        document.getElementById("failed-1").style.display = "inline";
      }
    } else {
      document.getElementById("failed-2").style.display = "inline";
    }
  };
}

function processLogOut() {
  localStorage.setItem("isLoggedIn", false);
  Window.onChange = conditionalRender();
  localStorage.setItem("token", invalid_token);
  localStorage.setItem("isAdmin", false);
  Window.onChange = conditionalRender();
}

function processSignUp() {
  let inputCheck = true;
  var data = new FormData();
  // take and pass input into a map
  var inputs = document.querySelectorAll("#sign-up-form input");
  for (let input of inputs) {
    if (input.value == null || input.value == undefined) {
      inputCheck = false;
      document.getElementById("signup-failed-2").style.display = "inline";
      document.getElementById("signup-failed-1").style.display = "none";
    }
    data.append(input.name, input.value);
  }

  if (data.get("password") !== data.get("password-retype")) {
    inputCheck = false;
    document.getElementById("signup-failed-2").style.display = "inline";
    document.getElementById("signup-failed-1").style.display = "none";
  }

  if (
    !passwordSanitize(data.get("password")) ||
    !numberSanitize(data.get("phone"))
  ) {
    inputCheck = false;
    document.getElementById("signup-failed-2").style.display = "inline";
    document.getElementById("signup-failed-1").style.display = "none";
  }

  if (inputCheck) {
    var url =
      apiLink +
      "AddUser?familyId=1&email=" +
      data.get("email") +
      "&password=" +
      data.get("password") +
      "&firstName=" +
      data.get("firstName") +
      "&lastName=" +
      data.get("lastName") +
      "&age=10" +
      "&phoneNumber=" +
      data.get("phone");

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.send();
    xhr.onload = () => {
      if (xhr.status == 200) {
        const token = xhr.response;
        if (token !== invalid_token) {
          localStorage.setItem("token", token);
          localStorage.setItem("isLoggedIn", true);
          document.getElementById("modalSignUpForm").click();
          window.onChange = conditionalRender();
        } else {
          document.getElementById("signup-failed-1").style.display = "inline";
          document.getElementById("signup-failed-2").style.display = "none";
        }
      } else {
        document.getElementById("signup-failed-2").style.display = "inline";
      }
    };
  }
}

window.onload = window.onchange = conditionalRender();
