const messages = document.querySelector("section ul");
const input = document.querySelector("#message-input");
const sendMessage = document.querySelector("#message-button");
const usernameInput = document.querySelector("#username-input");
const loggin = document.querySelector(".room section:first-of-type");
const chatScreen = document.querySelector(".room section:last-of-type");
const logginButton = document.querySelector(".room section:first-of-type > button");

const socket = io();

if (!chatScreen.classList.contains("hidden")) {
  chatScreen.classList.add("hidden");
}

// Annuleer the enter event on the input
usernameInput.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    sendMessage.click();
  }
});

// the user name auto fill for the user
const clientName = localStorage.getItem("room-name");
if (clientName !== null) {
  usernameInput.value = clientName;
}


// *******************
// *******************

let roomUsers = [];

const searchParams = new URLSearchParams(window.location.search);
const roomID = searchParams.get("room");
console.log("binQuery", roomID);

// log in and save the user name in the local Storage
logginButton.addEventListener("click", () => {
  loggin.classList.add("hidden");
  chatScreen.classList.remove("hidden");

  localStorage.setItem("room-name", usernameInput.value);

  roomUsers.push(usernameInput.value);

  // Stuur de lijst van gebruikers naar de server
  const data ={
    room: roomID,
    user: usernameInput.value,
    roomUsers: roomUsers
  }
  socket.emit("addRoom", {data} );

  console.log("user name", data);
});

const Rooms = []
socket.on("addRoom", (Room) => {
console.log("data",Room);
})


// Room admin Name
function adminName() {
  const Admin = usernameInput.value
  socket.emit("addAdmin", Admin );
}

adminName();

socket.on("addAdmin", (currentAdmin)=>{
  console.log("Room admin", currentAdmin);
})


input.addEventListener("input", () => {
  const inputValue = input.value;
  // Doe hier iets met de waarde van het invoerveld
  console.log(inputValue);
  chatScreen.classList.add("focus");
  socket.emit("focus", true); // Verzend de focus class naar andere clients
});

sendMessage.addEventListener("click", (event) => {
  chatScreen.classList.remove("focus");
  socket.emit("focus", false); // Verzend de focus class naar andere clients

  event.preventDefault();
  if (input.value) {
    const chat = {
      username: usernameInput.value,
      message: input.value,
      room: roomID
    };

    console.log(chat);

    socket.emit("chatmessage", chat);
    input.value = "";
  }
});

messages.dataset.room = new URLSearchParams(new URL(window.location).search).get("room")

socket.on("chatmessage", (msg) => {
  console.log("chat message: ", msg.message);

  const element = document.createElement("li");
  element.textContent = `${msg.message} `;
  element.dataset.username = `${msg.username}`


  // haal de data-room attribuut op van de parent ul om te bepalen in welke chatroom het bericht hoort
  const room = messages.getAttribute("data-room");
  if (msg.room === room) {
    messages.appendChild(element);
    messages.scrollTop = messages.scrollHeight;
  }

  if (msg.username === usernameInput.value) {
    element.classList.add("message");
  }

});

socket.on("focus", (hasFocus) => {
  if (hasFocus) {
    chatScreen.classList.add("focus");
  } else {
    chatScreen.classList.remove("focus");
  }
});









// ***********************
//     Gifs code
// ***********************

const gifInput = document.querySelector("#gifsearch");
const gifSearch = document.querySelector("#gif-button");
const gifList = document.querySelector(".room section:last-of-type form:last-of-type ul");
const gifButton = document.querySelector(".room section:last-of-type > button");
const gifForm = document.querySelector(".room section:last-of-type form:last-of-type")

gifButton.addEventListener("click", () => {
  if (gifList.classList.contains("search")) {
    gifList.classList.remove('search')
  }
  gifForm.classList.toggle('search')

})

// Annuleer the enter event on the input
gifInput.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    gifSearch.click();
  }
});

let searchKey = "";

// handle form submit event
gifSearch.addEventListener('click', (event) => {
  event.preventDefault(); // prevent page from reloading
  gifList.innerHTML = '';

  searchKey = gifInput.value

  console.log(searchKey);

  // make a fetch request to Giphy API to get a random GIF
  fetch(`https://api.gfycat.com/v1/gfycats/search?search_text=${searchKey}`)
    .then(response => response.json())
    .then(data => {
      // const gifUrl = data.data.image_url;
      const urlData = data.gfycats

      for (let i = 0; i < urlData.length; i++) {
        const Gifs = data.gfycats[i].max2mbGif;

        const li = document.createElement("li")
        const button = document.createElement("button")
        const img = document.createElement("img")

        img.src = Gifs;
        img.alt = searchKey, "gif image";

        button.appendChild(img)
        li.appendChild(button)
        gifList.appendChild(li)
        // add event listener to button
        button.addEventListener('click', (event) => {
          event.preventDefault();
          console.log('Image clicked', Gifs);

          // send gif data via socket
          const message = {
            gifUrl: Gifs,
            room: roomID,
            userName: usernameInput.value,
            searchKey: searchKey
          };

          console.log("ii", message);
          socket.emit('gifmessage', message);
        });
      }

      if(searchKey === ""){
        gifList.classList.remove('search')
        console.log("no",gifList);
      } else{
        gifList.classList.add('search')
        console.log("yes",gifList);
      }

    })
    .catch(error => {
      console.error(error);
    });
});


// receive gif data via socket
socket.on("gifmessage", (msg) => {
  console.log("imgSrc", msg);

  console.log("roomID" , roomID);
  const room = messages.getAttribute("data-room");

  // create li element with gif image
  const li = document.createElement("li");
  const img = document.createElement("img");

  img.src = msg.gifMessage;
  li.dataset.username = `${msg.userName}`

  li.appendChild(img);

  if (msg.room === room) {
    const messageschat = document.querySelector("section ul");
    messageschat.appendChild(li);
    messageschat.scrollTop = messageschat.scrollHeight;
    console.log("hi", messageschat);
  }

  if (msg.userName === usernameInput.value) {
    li.classList.add("message");
  }

});









// ***********************
//     iframe code
// ***********************

let videoLink = document.querySelector("header section form input");
const videoStart = document.querySelector("header section form button");
const iframe = document.querySelector("header div iframe");

videoStart.addEventListener("click", () => {
  if (videoLink.value.includes("embed")) {
    iframe.src = videoLink.value;
  } else if (videoLink.value.includes("https://www.youtube.com/")) {
    console.log(videoLink.value);
    let newURL = new URL(videoLink.value);
    console.log(newURL);
    let urlSearch = newURL.search;
    let searchID = urlSearch.substring(3);
    console.log("newStr", searchID);
    let iframeSRC = newURL.origin + "/embed/" + searchID;
    iframe.src = iframeSRC;
    console.log("iframeSRC", iframeSRC);
    // ?controls=0
  } else {
    console.log("no");
  }
});

videoLink.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    videoStart.click();
  }
});

