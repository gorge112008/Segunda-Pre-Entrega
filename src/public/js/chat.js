/*CHAT*/

/*********************************************************CONSTANTES/VARIABLES*************************************************************/
const socket = io();
let URLdomain = window.location.host;
let protocol = window.location.protocol;
let UrlU = protocol + "//" + URLdomain + "/api/users/";
let UrlM = protocol + "//" + URLdomain + "/api/messages/";
let swalActive = "inactive";
let email;
let backMessages = [];

let log = document.querySelector(".chat__container__dinamic");

const chatBox = document.getElementById("chatBox"),
  btnSend = document.getElementById("btnSend"),
  emailLogged = document.querySelector(".nav__container--email-logged"),
  existSession = sessionStorage.getItem("user");

/*****************************************************************CLASES*************************************************************/

class newUser {
  constructor(email) {
    this.id = socket.id;
    this.first_name = "";
    this.last_name = "";
    this.email = email;
  }
}

class newMessage {
  constructor(user, message) {
    this.user = user;
    this.message = message;
  }
}
/*****************************************************************FUNCIONES*************************************************************/

function loadMessages() {
  /***************************LOAD MSJS DIRECTLY FROM DATABASE***************************/
  /*getData(UrlM).then((data) => {
    let messages = "";
    data.forEach((elem) => {
      messages += `
      <div class="chat__message">
        <div class="chat__message--bubble">
          <div class="chat__message--sender">${elem.user}</div>
          <p>${elem.message}</p>
        </div>
      </div>
      `;
    });
    log.innerHTML = messages;
    const bubbleMessage = document.querySelectorAll(".chat__message--bubble");
    bubbleMessage[bubbleMessage.length - 1].scrollIntoView();
  });
}*/

  /******************************LOAD MSJS FROM ARRAY**************************************/
  let messages = "";
  backMessages.forEach((elem) => {
    messages += `
      <div class="chat__message">
        <div class="chat__message--bubble">
          <div class="chat__message--sender">${elem.user}</div>
          <p>${elem.message}</p>
        </div>
      </div>
      `;
    log.innerHTML = messages;
    const bubbleMessage = document.querySelectorAll(".chat__message--bubble");
    bubbleMessage[bubbleMessage.length - 1].scrollIntoView();
  });
}

async function validateSession(email) {
  swalActive = "active";
  Swal.fire({
    title: "ACTIVE SESSION",
    text: "Welcome user: " + email,
    icon: "info",
    showDenyButton: true,
    confirmButtonText: "Continue session",
    denyButtonText: "Close session",
    preConfirm: () => {
      swalActive = "inactive";
    },
  }).then((result) => {
    if (result.isConfirmed) {
      emailLogged.innerHTML = `<b>${existSession}<b>`;
      socket.emit("newUser", { user: existSession, id: socket.id });
      loadMessages();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Session Started Successfully",
        showConfirmButton: false,
        allowOutsideClick: false,
        timer: 1500,
      });
    } else if (result.isDenied) {
      closeSession(email);
    }
  });
}

async function closeSession(email) {
  swalActive = "active";
  Swal.fire({
    title: "ARE YOU SURE TO END YOUR SESSION?",
    text: "Active session: " + email + "",
    icon: "warning",
    showDenyButton: true,
    confirmButtonColor: "#3085d6",
    denyButtonColor: "#d33",
    confirmButtonText: "Yes, close session.",
    denyButtonText: "Not, cancel.",
    preConfirm: () => {
      swalActive = "inactive";
    },
  }).then((result) => {
    if (result.isConfirmed) {
      setTimeout(() => {
        sessionStorage.removeItem("user");
        window.location.reload();
      }, 1500),
        Swal.fire({
          position: "center",
          icon: "success",
          title: "You have successfully ended your session",
          showConfirmButton: false,
          allowOutsideClick: false,
        });
    } else if (result.isDenied) {
      validateSession(email);
    }
  });
}

function sendMessage(){
  if (chatBox.value.trim().length > 0) {
    const newmessage = new newMessage(email, chatBox.value);
    postData(UrlM, newmessage).then((lastMessage) => {
      console.log("Message send");
      socket.emit("newMessage", lastMessage);
    });
    chatBox.value = "";
  }
}

async function focusbtn(){
  const buttonsMax = document.querySelectorAll(".div__container--focusBtn a");
  const buttonsMin = document.querySelectorAll(".asideSD__dropdown--contain a");
  buttonsMax.forEach((button) => {
    button.href == window.location.href
      ? button.classList.add("active")
      : button.classList.remove("active");
  });
  buttonsMin.forEach((button) => {
    button.href == window.location.href
      ? button.classList.add("active")
      : button.classList.remove("active");
  });
}

/*INICIO FUNCIONES CRUD*/
async function getData(url) {
  try {
    let response = await fetch(url, {
      method: "GET",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
    });
    const data = await response.json();
    return data;
  } catch {
    console.log(Error);
  }
}

async function postData(url, data) {
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
      body: JSON.stringify(data),
    });
    if (response.status == 400) {
      console.warn("Error en el cliente");
      return;
    } else if (response.status == 200) {
      return response.json();
    }
  } catch {
    console.log(Error);
  }
}

async function updateData(url, id, data) {
  try {
    let key = url + id;
    let response = await fetch(key, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
      body: JSON.stringify(data),
    });
    if (response.status == 400) {
      console.warn("Error en el cliente");
      return;
    } else if (response.status == 200) {
      const datos = await response.json();
      return datos;
    }
  } catch {
    console.log(Error);
  }
}

async function deleteData(url, id) {
  try {
    let key = url + id;
    let response = await fetch(key, {
      method: "DELETE",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      mode: "cors",
    });
    return response.json();
  } catch {
    console.log(Error);
  }
}
/*FIN FUNCIONES CRUD*/

/*****************************************************************SOCKETS*************************************************************/
socket.on("backMessages", (getMessages) => {
  Object.assign(backMessages, getMessages);
  focusbtn();
  console.log("SUMMARY OF MESSAGES: " + backMessages.length);
});

socket.on("newUser-connected", (userNew) => {
  if (swalActive == "inactive") {
    if (userNew.id !== socket.id)
      Swal.fire({
        html: `<b class="chat__login--notification">${userNew.user} has connected to the chat<b>`,
        toast: true,
        position: "top-end",
        timer: 2000,
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      });
  }
});

socket.on("messageLogs", (lastMessage) => {
  backMessages.push(lastMessage);
  console.log("SUMMARY OF MESSAGES: " + backMessages.length);
  let log = document.querySelector(".chat__container__dinamic");
  const { user, message } = lastMessage;
  const newBubble = `
      <div class="chat__message">
      <div class="chat__message--bubble">
        <div class="chat__message--sender">${user}</div>
        <p>${message}</p>
        </div>
      </div>
    `;
  log.innerHTML += newBubble;
  const bubbleMessage = document.querySelectorAll(".chat__message--bubble");
  bubbleMessage[bubbleMessage.length - 1].scrollIntoView();
});

/*****************************************************************EVENTOS*************************************************************/
if (existSession != null) {
  email = existSession;
  validateSession(email);
} else {
  swalActive = "active";
  Swal.fire({
    title: '<b class="chat__login--tittle">Welcome to chat</b>',
    html: '<u class="chat__login--text">Enter your email</u>',
    input: "email",
    showDenyButton: true,
    confirmButtonText: '<b class="chat__login--confirm">Confirm</b>',
    denyButtonText: '<b class="chat__login--exit">Exit</b>',
    showLoaderOnConfirm: true,
    background:
      '#fff url("https://img.freepik.com/vector-gratis/fondo-degradado-cielo-pastel_23-2148917404.jpg?w=2000")',
    footer:
      '<a class="chat__footer--left" href="../home">Go to Home</a><a class="chat__footer--right" href="../realtimeproducts">Go to RealtimeProducts</a>',
    inputPlaceholder: "Enter here...",
    preConfirm: () => {
      swalActive = "inactive";
    },
    allowOutsideClick: false,
    backdrop: "rgba(0,0,123,0.4)",
  })
    .then(async (result) => {
      if (result.isConfirmed) {
        if (result.isDismissed) {
          window.location.reload();
        } else {
          if (result.value) {
            email = result.value;
            const newuser = new newUser(email);
            emailLogged.innerHTML = `<b>${email}<b>`;
            postData(UrlU, newuser)
              .then((data) => {
                  const { email } = data;
                  console.log("Email is stored: " + email);
                  sessionStorage.setItem("user", email);     
              })
              .catch((error) => console.log("Error:" + error));
            socket.emit("newUser", { user: email, id: socket.id });
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Session Started Successfully",
              timer: 1500,
              showConfirmButton: false,
              allowOutsideClick: false,
            });
            const bubbleMessage = document.querySelectorAll(
              ".chat__message--bubble"
            );
            bubbleMessage[bubbleMessage.length - 1].scrollIntoView();
          }
        }
      } else if (result.isDenied) {
        window.location.href = "../";
      }
    })
    .catch((error) => {
      Swal.showValidationMessage(`Request failed: ${error}`);
    });
}

chatBox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

btnSend.addEventListener("click", () => {
    sendMessage();
});

emailLogged.onclick = () => {
  validateSession(email).click();
};