const messages = document.querySelector("section ul");
const messageInput = document.querySelector("#message-input");
const sendMessage = document.querySelector("#message-button");
const usernameInput = document.querySelector("#username-input");
const loggin = document.querySelector(".room section:first-of-type");
const chatScreen = document.querySelector(".room section:last-of-type");
const logginButton = document.querySelector(".room section:first-of-type > button");

// ***********************
//     iframe code
// ***********************

const h1 = document.querySelector("header section h1")
let videoForm = document.querySelector("header section form")
let videoLinkInput = document.querySelector("header section form input");
const videoSendLinkbutton = document.querySelector("header section form button");
const iframe = document.querySelector("header div iframe");
const span = document.querySelector("header div span");
const streamStart = document.querySelector("header div button");
const streamStop = document.querySelector("header section > button:first-of-type");
const roomLinkbutton = document.querySelector("header section > button:last-of-type");


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

// let roomUsers = [];

const searchParams = new URLSearchParams(window.location.search);
const roomID = searchParams.get("room");
console.log("binQuery", roomID);

roomLinkbutton.addEventListener("click", () => {
  var copyText = window.location.href;

  // copyText.select();
  // copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
  navigator.clipboard.writeText(copyText);

    // Alert the copied text
  console.log("Copied the text: ", copyText);
})


// log in and save the user name in the local Storage
logginButton.addEventListener("click", () => {
  loggin.classList.add("hidden");
  chatScreen.classList.remove("hidden");

  // localStorage.setItem("room-name", usernameInput.value);

  // Stuur de lijst van gebruikers naar de server
  const data = {
    room: roomID,
    user: usernameInput.value,
  }

  socket.emit("joinRoom", data);
  socket.emit("roomAdmin", roomID);

});


socket.on("joinRoom", (data) => {
  const Room = data.Room;
  const roomUser = data.roomUser;
  const roomUsers = data.roomUsers;

  roomAdmin(roomUsers);

  console.log("data", Room, roomUser, roomUsers);
})


// Room admin

function roomAdmin(roomUsers) {
  const room = roomUsers.find(room => room.ID === roomID);

  const currentAdmin = room.users[0];

  h1.textContent = `Admin ${currentAdmin}`;
  
  socket.emit("roomAdmin", {currentAdmin , roomID });
}

socket.on("roomAdmin", (roomData) => {
  console.log("roomData",roomData.users);
  console.log("roomData id",roomData.ID);
  
  const room = messages.getAttribute("data-room");

  if (roomData.ID === room) {
    if (roomData.users[0] === usernameInput.value) {
      videoForm.classList.add("admin");
      span.classList.add("admin");
      streamStart.classList.add("admin");
    }
  }
})


messageInput.addEventListener("input", () => {
  const inputValue = messageInput.value;
  // Doe hier iets met de waarde van het invoerveld
  console.log(inputValue);
  chatScreen.classList.add("focus");
  socket.emit("focus", true); // Verzend de focus class naar andere clients
});

sendMessage.addEventListener("click", (event) => {
  chatScreen.classList.remove("focus");
  socket.emit("focus", false); // Verzend de focus class naar andere clients

  event.preventDefault();
  if (messageInput.value) {
    const chat = {
      username: usernameInput.value,
      message: messageInput.value,
      room: roomID
    };

    console.log(chat);

    socket.emit("chatmessage", chat);
    messageInput.value = "";
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

      if (searchKey === "") {
        gifList.classList.remove('search')
        console.log("no", gifList);
      } else {
        gifList.classList.add('search')
        console.log("yes", gifList);
      }

    })
    .catch(error => {
      console.error(error);
    });
});


// receive gif data via socket
socket.on("gifmessage", (msg) => {
  console.log("imgSrc", msg);

  console.log("roomID", roomID);
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
    messages.scrollTop = messages.scrollHeight;
    console.log("hi", messageschat);
  }

  if (msg.userName === usernameInput.value) {
    li.classList.add("message");
  }

});









// ***********************
//     iframe code
// ***********************

let link;

videoLinkInput.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    videoSendLinkbutton.click();
  }
});


videoSendLinkbutton.addEventListener("click", () => {

  if (videoLinkInput.value.includes("embed")) {
    iframe.src = videoLinkInput.value + "?controls=0";

    link = iframe.src
    console.log("iframeSRC", {link, roomID});

    socket.emit('streamLink', {link, roomID});
  }

  else if (videoLinkInput.value.includes("https://www.youtube.com/")) {
    console.log(videoLinkInput.value);
    let newURL = new URL(videoLinkInput.value);
    console.log(newURL);
    let urlSearch = newURL.search;
    let searchID = urlSearch.substring(3);
    console.log("newStr", searchID);
    let iframeSRC = newURL.origin + "/embed/" + searchID + "?controls=0";
    iframe.src = iframeSRC;
    // ?controls=0

     link = iframe.src
    console.log("iframeSRC", link, roomID);

    socket.emit('streamLink', {link, roomID});
  }
});

socket.on("streamLink", (data) => {
  const room = messages.getAttribute("data-room");

  console.log("LINK", data.link);

  if (data.roomID === room) {
    iframe.src = data.link;
  }
})

const startvideo = "&autoplay=1";
const stopvideo = "&autoplay=0";

// "&autoplay=1"
streamStart.addEventListener("click", () => {
  iframe.src = link + startvideo;
  const iframeLink = iframe.src

  console.log("streamStart", iframeLink);

  streamStart.classList.remove("admin")
  streamStop.classList.add('admin')

  socket.emit('startStream', {iframeLink, roomID});
});


socket.on("startStream", (data) => {
  const room = messages.getAttribute("data-room");

  console.log("startStream",data);

  if (data.roomID === room) {
    iframe.src = data.iframeLink;
    console.log(iframe);
  }
})

streamStop.addEventListener("click", () => {
  iframe.src = link + stopvideo;
  const iframeLink = iframe.src

  console.log("streamStop", iframeLink);

  streamStart.classList.add("admin")
  streamStop.classList.remove('admin')

  socket.emit('stopStream', {iframeLink, roomID});
});

socket.on("stopStream", (data) => {
  const room = messages.getAttribute("data-room");

  console.log("stopStream",data);
  

  if (data.roomID === room) {
    iframe.src = data.iframeLink;
    console.log(iframe);
  }
})
