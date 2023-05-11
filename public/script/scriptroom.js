// ==========================================================================
// fast comments
// ==========================================================================

// username check
// start chatting
// Room admin
// share room link
// user connected
// typeing note

// chat messages 
//  Gifs messages
// iframe code
// chatHistory code

// ==========================================================================
// ==========================================================================

const messages = document.querySelector(".room section:last-of-type ul");
const messageInput = document.querySelector("#message-input");
const sendMessage = document.querySelector("#message-button");

const usernameInput = document.querySelector("#username-input");

const badNameNote = document.querySelector("main.room section:first-of-type form p")
const avatarsInput = document.querySelectorAll("main.room section:first-of-type form ul li input");

const loggin = document.querySelector(".room section:first-of-type");
const chatScreen = document.querySelector(".room section:last-of-type");
const startChattingButton = document.querySelector(".room section:first-of-type > button");

const loadingChat = document.querySelector(".room section:last-of-type > div");

// ***********************
//     iframe variabels
// ***********************

const h1 = document.querySelector("header section h1")
let videoForm = document.querySelector("header section form")
let videoLinkInput = document.querySelector("header section form input");
const videoSendLinkbutton = document.querySelector("header section form button");
const span = document.querySelector("header div span");
const streamStart = document.querySelector("header div button");
const streamStop = document.querySelector("header section > button:first-of-type");
const roomLinkbutton = document.querySelector("header section > button:last-of-type");


const searchParams = new URLSearchParams(window.location.search);
const roomID = searchParams.get("room");
console.log("roomID", roomID);
messages.dataset.room = new URLSearchParams(new URL(window.location).search).get("room")
const room = messages.getAttribute("data-room");
const socket = io();


let url = new URL(window.location).origin
const ENDbutton = document.querySelector("header section > a")
// ENDbutton.href = url;

console.log("url", ENDbutton);

let myname;

// username check  ==========================================================================

// Annuleer the enter event on the username input
usernameInput.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    sendMessage.click();
  }
});

function nameCheck() {
  console.log(usernameInput.value);
  clientName = usernameInput.value
  socket.emit('nameCheck', { roomID, clientName });
}

usernameInput.addEventListener("input", nameCheck);

function nameFeedback() {
  if (usernameInput.value.trim() === '') {
    console.log('Form is invalid', badNameNote);
    badNameNote.innerHTML = "Form is invalid"
    badNameNote.classList.add('badname');
    startChattingButton.classList.remove('startChating');

  } else {
    console.log('Form is valid', badNameNote);
    badNameNote.classList.remove('badname');
    startChattingButton.classList.add('startChating');
  }
}

socket.on('nameCheck', (data) => {
  console.log("nameCheck data", data);
  const room = messages.getAttribute("data-room");
  console.log("currentRoomUsers", data);
  if (data.currentRoomUsers) {
    const currentRoomUsers = data.currentRoomUsers;

    if (currentRoomUsers.includes(data.client)) {
      badNameNote.innerHTML = `The username ${data.client} has been used`;
      usernameInput.classList.add('badName')
      usernameInput.classList.replace('goodName', 'badName')
      console.log("check", usernameInput);
      startChattingButton.classList.remove('startChating');
    } else {
      badNameNote.innerHTML = ""
      usernameInput.classList.replace('badName', 'goodName')
      startChattingButton.classList.add('startChating');
    }
  } else {
    badNameNote.innerHTML = ""
    usernameInput.classList.add('goodName')
    startChattingButton.classList.add('startChating');
  }
})










// start chatting ==========================================================================

startChattingButton.addEventListener("click", () => {
  // Stuur de lijst van gebruikers naar de server
  const data = {
    room: roomID,
    user: usernameInput.value,
  }

  myname = usernameInput.value

  socket.data = { username: data.user, roomID: room }
  socket.emit("joinRoom", data);
  socket.emit("roomAdmin", roomID);

  loggin.classList.add("hidden");
  chatScreen.classList.remove("hidden");

  setTimeout(() => {
    loadingChat.classList.add("noLoading");
  }, 2500);
});

socket.on("joinRoom", (data) => {
  const room = messages.getAttribute("data-room");

  const Room = data.Room;
  const roomUser = data.roomUser;
  const roomUsers = data.roomUsers;

  const liElement = document.createElement("li")
  liElement.classList.add("note")
  liElement.innerHTML = `
  <p>${roomUser} joined the chat</p>
  `
  if (Room === room) {
    messages.appendChild(liElement)
    messages.scrollTop = messages.scrollHeight;
  }
  roomAdmin(roomUsers);
})





// Room admin ==========================================================================

function roomAdmin(roomUsers) {
  const room = roomUsers.find(room => room.ID === roomID);

  const currentAdmin = room.users[0];
  h1.textContent = `Admin ${currentAdmin}`;

  socket.emit("roomAdmin", { currentAdmin, roomID });
}

socket.on("roomAdmin", (roomData) => {
  console.log("room admin:", roomData);
  // console.log("roomData id", roomData.ID);

  const room = messages.getAttribute("data-room");

  if (roomData.ID === room) {
    if (roomData.users[0] === usernameInput.value) {
      videoForm.classList.add("admin");
      span.classList.add("admin");
      // streamStart.classList.add("admin");
    }
  }
})





// share room link ==========================================================================

roomLinkbutton.addEventListener("click", () => {
  var copyText = window.location.href;

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText);

  roomLinkbutton.textContent = "✔️"
  setTimeout(() => {
    roomLinkbutton.textContent = "🔗"
  }, 4000);

  // Alert the copied text
  console.log("Copied the text: ", copyText);
})











//  user connected ==========================================================================

function checkConnection() {
  if (socket.connected) {
      console.log('Socket is connected');
      // chatScreen.classList.remove('socket-disconnected');
  } else {
      console.log('Socket is disconnected');
      // chatScreen.classList.add('socket-disconnected');
      // setTimeout(() => {
      //     if (!socket.connected) {
      //         const error = document.querySelector('#error');
      //         error.textContent = 'You are disconnected';
      //         error.classList.add('show');
      //     }
      // }, 5000);
  }
}

function connected() {
  const usersImg = document.querySelectorAll(".room section:last-of-type>ul li>div:first-of-type")
  console.log("connected user");
  for (let i = 0; i < usersImg.length; i++) {
    if (usersImg[i]) {
      usersImg[i].classList.add('connected');
    }
  }

  console.log(usernameInput.value, 'is online');
}

socket.on('connected', () => {
  connected();
  checkConnection();

  setInterval(checkConnection, 1000);
})


function connectedtest(ChatMsg) {
  if (ChatMsg.firstElementChild.classList.contains("connected")) {
    ChatMsg.firstElementChild.classList.remove('connected');
    console.log("notconnected", ChatMsg);
  }
}

socket.on('notconnected', (data) => {
  console.log(data.users);

  const usersData = data.users;
  const chatMessages = document.querySelectorAll('main.room section:last-of-type>ul li')

  for (let i = 0; i < chatMessages.length; i++) {
    const dataset = chatMessages[i].dataset.client;
    // console.log("dataset 2", dataset);

    if (dataset === data.userName) {
      let ChatMsg = chatMessages[i];
      connectedtest(ChatMsg);
    }
    roomAdmin(data.users);
  }


  const liElement = document.createElement("li")
  liElement.classList.add("note")
  liElement.innerHTML = `
  <p>${data.userName} left the chat</p>
  `
  const room = messages.getAttribute("data-room");

  if (data.roomID === room) {
    messages.appendChild(liElement)
    console.log(liElement);
  }
})






// typeing note ==========================================================================

const writingNote = document.querySelector("main.room > p")
socket.on("focus", (data) => {
  const room = messages.getAttribute("data-room");
  // console.log("data Focus", data);
  if (data.roomID === room) {
    console.log("HI 0");
    if (data.hasFocus) {
      console.log("HI 1");
      writingNote.innerHTML = `<span>${data.userName}</span> is writing`;
      writingNote.classList.add("focus");
    } else {
      console.log("HI 2");
      writingNote.innerHTML = "";
      writingNote.classList.remove("focus");
    }
  }
});









// ===================
// chat messages
// ===================
messageInput.addEventListener("input", () => {
  const inputValue = messageInput.value;
  console.log(inputValue);
  chatScreen.classList.add("focus");
  const userName = usernameInput.value
  socket.emit("focus", { hasFocus: true, roomID: roomID, userName: userName });
});

sendMessage.addEventListener("click", (event) => {

  let currentTimeNL = new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });

  let avatarsrc;
  for (let i = 0; i < avatarsInput.length; i++) {
    if (avatarsInput[i].checked) {
      let labelChecked = avatarsInput[i].nextElementSibling
      avatarsrc = labelChecked.dataset.avatar
      console.log(avatarsrc, [i]);
    }
  }

  event.preventDefault();
  if (messageInput.value) {
    const chat = {
      username: usernameInput.value,
      message: messageInput.value,
      room: roomID,
      avatar: avatarsrc,
      time: currentTimeNL
    };

    // console.log(chat);

    socket.emit("chatmessage", chat);
    messageInput.value = "";

    chatScreen.classList.remove("focus");
    socket.emit("focus", { hasFocus: false, roomID: roomID, userName: chat.username });
  }

});


socket.on("chatmessage", (msg) => {
  const element = document.createElement("li");
  element.dataset.client = `${msg.username}`;
  element.innerHTML = `
          <div id="userImg">
             <img src="${msg.avatar}" alt="${msg.avatar} icon">
          </div>
          <p data-username="${msg.username}">${msg.message}</p>
         `
  const room = messages.getAttribute("data-room");
  element.classList.add("time");
  element.dataset.time = `${msg.time}`;

  if (msg.room === room) {
    console.log("element", element);
    messages.appendChild(element);
    messages.scrollTop = messages.scrollHeight;
    connected(messages)
  }

  if (msg.username === usernameInput.value) {
    element.classList.add("message");
  }
});









// ***********************
//     Gifs messages
// ***********************

const gifInput = document.querySelector("#gifsearch");
const gifSearch = document.querySelector("#gif-button");
const gifList = document.querySelector(".room section:last-of-type > form ul");
const gifButton = document.querySelector(".room section:last-of-type > span > button");
const gifForm = document.querySelector(".room section:last-of-type > form")
let searchKey = "";

gifInput.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    gifSearch.click();
  }
});

gifButton.addEventListener("click", () => {
  if (gifList.classList.contains("search")) {

    gifList.classList.remove('search')
  }
  gifForm.classList.toggle('search')

  if (gifButton.innerHTML === "GIF") {
    gifButton.innerHTML = "⛌";
  } else {
    gifButton.innerHTML = "GIF";
  }
})


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
        let avatarsrc;
        for (let i = 0; i < avatarsInput.length; i++) {
          if (avatarsInput[i].checked) {
            let labelChecked = avatarsInput[i].nextElementSibling
            avatarsrc = labelChecked.dataset.avatar
            console.log(avatarsrc, [i]);
          }
        }

        button.addEventListener('click', (event) => {
          event.preventDefault();
          let currentTimeNL = new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
          console.log('Image clicked', Gifs);

          // send gif data via socket
          const message = {
            gifUrl: Gifs,
            room: roomID,
            userName: usernameInput.value,
            searchKey: searchKey,
            avatar: avatarsrc,
            time: currentTimeNL
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
  const room = messages.getAttribute("data-room");
  const li = document.createElement("li");
  li.dataset.client = `${msg.userName}`;

  li.innerHTML = `
  <div>
    <img src="${msg.avatar}" alt="">
  </div>
  <div data-username="${msg.userName}">
  <img src="${msg.gifMessage}" alt="">
  </div>
  `

  li.classList.add("time");
  li.dataset.time = `${msg.time}`;

  if (msg.room === room) {
    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight;
    console.log("hi", messages);
  }

  if (msg.userName === usernameInput.value) {
    li.classList.add("message");
  }
});









// ***********************
//     iframe code
// ***********************
const videoFrame = document.getElementById("videoFrame");

let link = '';
let player;
let videoId = '';
let playerLink = videoLinkInput.value;


document.addEventListener("DOMContentLoaded", function () {
  videoLinkInput.addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      videoSendLinkbutton.click();
    }
  });

  videoLinkInput.addEventListener('input', () => {
    // The value is a space or an empty string
    if (videoLinkInput.value.trim() === '') {
      console.log("1");
      videoSendLinkbutton.classList.remove("admin");
    } else {
      console.log("2");
      videoSendLinkbutton.classList.add("admin");
    }
  })

  function onYouTubeIframeAPIReady(videoUrl) {
    console.log("onYouTubeIframeAPIReady:", videoUrl);
    const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//;

    if (youtubeUrlRegex.test(videoUrl)) {
      const ytlink = videoUrl.match(/(\?v=|\/embed\/|\/\d\/|\/vi\/|\/v\/|youtu\.be\/|\/e\/|\/watch\?v=|\/watch\?feature=player_embedded&v=|\/watch\?v%3D|^v\=|\/embed\/|youtu\.be\/|\/e\/|watch\?v=|v%3D|youtu\.be\/|embed\/|watch\?v%3D|youtube.com\/user\/[^#]*#([^\/]*\/)*)?([^#\&\?\/]*)/)[3];

      // Check of de link is gewijzigd
      if (videoUrl !== ytlink) {
        if (player) {
          console.log("HIIIOOOO");
          player.destroy();
        }
      }

      console.log("YT test", ytlink);

      let newURL = new URL(videoUrl).pathname;

      const parts = newURL.split("/");
      const videoId = parts[parts.length - 1];

      player = new YT.Player(videoFrame, {
        videoId: videoId,
        playerVars: {
          'playsinline': 1,
          'controls': 0
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });

      const liElement = document.createElement("li")
      liElement.classList.add("note")
      liElement.innerHTML = `
      <p><a href="${videoUrl}" target ="blank">Open current video on YouTube ↗️</a></p>
      `
      messages.appendChild(liElement)
      messages.scrollTop = messages.scrollHeight;
      console.log("Hi yt");

    } else {
      videoLinkInput.value = '';
      videoLinkInput.placeholder = "Invalid YouTube URL"
      const liElement = document.createElement("li")
      liElement.classList.add("note")
      liElement.innerHTML = `
      <p><a>Invalid link 💔</a></p>
      `
      messages.appendChild(liElement)
      messages.scrollTop = messages.scrollHeight;
      console.log("Ongeldige YouTube-video-URL");
    }
  }

  videoSendLinkbutton.addEventListener("click", () => {
    streamStart.classList.add("admin")
    streamStop.classList.remove('admin')
    videoSendLinkbutton.textContent = "🔁"

    const videoUrl = videoLinkInput.value;

    if (videoUrl.includes("embed")) {
      link = videoUrl + "?controls=0";

      onYouTubeIframeAPIReady(link);
      // onPlayerStateChange();

      socket.emit('streamLink', { link, roomID });
      console.log("iframeSRC", { link, roomID });
    }

    else if (videoUrl.includes("https://www.youtube.com/")) {
      console.log(videoUrl);
      let newURL = new URL(videoUrl);
      console.log("newURL", newURL);
      let urlSearch = newURL.search;
      let searchID = urlSearch.substring(3);
      console.log("newStr", searchID);
      let iframeSRC = newURL.origin + "/embed/" + searchID + "?controls=0";
      link = iframeSRC

      onYouTubeIframeAPIReady(link);

      socket.emit('streamLink', { link, roomID });
    }
    else {

      console.log("else searchID", videoUrl);
      link = videoUrl;

      onYouTubeIframeAPIReady(videoUrl);
      socket.emit('streamLink', { link, roomID });
    }

    onPlayerStateChange(videoUrl);

    socket.emit('stopVideo')
  });

  socket.on("streamLink", (data) => {
    const room = messages.getAttribute("data-room");
    if (data.roomID === room) {
      onYouTubeIframeAPIReady(data.link)
    };
  })

  function onPlayerStateChange() {
    console.log('Player state has changed');
  }

  function onPlayerReady(event) {
    console.log('player ready!');
    player = event.target;
    streamStart.addEventListener('click', playYTVideo);
    streamStop.addEventListener('click', stopYTVideo);

  }

  function stopYTVideo() {
    streamStart.classList.add("admin")
    streamStop.classList.remove("admin")
    console.log("Player is paused");
    socket.emit('stopStream', roomID);
  }

  function playYTVideo() {
    streamStart.classList.remove("admin")
    streamStop.classList.add("admin")

    console.log("Player is ready", player.videoTitle);
    socket.emit('startStream', roomID);
  }

  socket.on('startStream', (roomID) => {
    const room = messages.getAttribute("data-room");
    if (roomID === room) {

      player.playVideo();
      player.seekTo(0);

      console.log("play video");
    };
  })

  socket.on('stopStream', (roomID) => {
    const room = messages.getAttribute("data-room");
    if (roomID === room) {
      player.stopVideo();

      console.log("stop video");
    };
  })

})










// ***********************
//     chatHistory code
// ***********************
socket.on('chatHistory', (roomHistory) => {
  let roomDataHistory;
  let roomChatlist = document.querySelectorAll(".room section:last-of-type ul li");
  const room = messages.getAttribute("data-room");

  for (let t = 0; t < roomHistory.length; t++) {
    console.log("roomHistory[i]", roomDataHistory);
    if (roomHistory[t].roomID === room) {
      roomDataHistory = roomHistory[t].messages
      console.log("his msg", roomDataHistory);
    }

    for (let i = 0; i < roomDataHistory.length; i++) {
      const liElement = document.createElement("li");

      // console.log("roomDataHistory", roomDataHistory);

      if (roomDataHistory.length !== roomChatlist.length) {

        // console.log("hi history", roomDataHistory.length, roomChatlist.length);

        // gifs history
        if (roomDataHistory[i].gifMessage) {
          // console.log("is is gif", roomDataHistory[i].userName);
          liElement.innerHTML = `
            <div>
              <img src="${roomDataHistory[i].avatar}" alt="${roomDataHistory[i].avatar}">
            </div>
            <div data-username="${roomDataHistory[i].userName}">
            <img src="${roomDataHistory[i].gifMessage}" alt="${roomDataHistory[i].gifMessage} GIF foto">
            </div>
            `
            if (roomDataHistory[i].username === myname ) {  
              liElement.classList.add("message");
            }

          messages.appendChild(liElement);
          messages.scrollTop = messages.scrollHeight;
        }

        // text messages
        if (!roomDataHistory[i].gifMessage) {

          const liElement = document.createElement("li");
          liElement.innerHTML = `
              <div id="userImg">
                <img src="${roomDataHistory[i].avatar}" alt="${roomDataHistory[i].avatar} icon">
              </div>
              <p data-username="${roomDataHistory[i].username}">${roomDataHistory[i].message}</p>
            `

          liElement.classList.add("time");
          liElement.dataset.time = `${roomDataHistory[i].time}`;
          
          if (roomDataHistory[i].username === myname ) {
            liElement.classList.add("message");
          }

          messages.appendChild(liElement);
          messages.scrollTop = messages.scrollHeight;

        }
      }
    }
  }
})