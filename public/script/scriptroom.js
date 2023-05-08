const messages = document.querySelector(".room section:last-of-type ul");
const messageInput = document.querySelector("#message-input");
const sendMessage = document.querySelector("#message-button");

const usernameInput = document.querySelector("#username-input");
const avatarsInput = document.querySelectorAll("main.room section:first-of-type form ul li input");

const loggin = document.querySelector(".room section:first-of-type");
const chatScreen = document.querySelector(".room section:last-of-type");
const startChattingButton = document.querySelector(".room section:first-of-type > button");

const loadingChat = document.querySelector(".room section:last-of-type > div");
console.log(startChattingButton);

// ***********************
//     iframe code
// ***********************

const h1 = document.querySelector("header section h1")
let videoForm = document.querySelector("header section form")
let videoLinkInput = document.querySelector("header section form input");
const videoSendLinkbutton = document.querySelector("header section form button");
// const iframe = document.querySelector("header div iframe");
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

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText);

  // Alert the copied text
  console.log("Copied the text: ", copyText);
})


// log in and save the user name in the local Storage
startChattingButton.addEventListener("click", () => {

  loggin.classList.add("hidden");
  chatScreen.classList.remove("hidden");

  // Stuur de lijst van gebruikers naar de server
  const data = {
    room: roomID,
    user: usernameInput.value,
  }

  socket.emit("joinRoom", data);
  socket.emit("roomAdmin", roomID);

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
    console.log(liElement);
  }

  roomAdmin(roomUsers);

  console.log("data", Room, roomUser, roomUsers);
})


// Room admin

function roomAdmin(roomUsers) {
  const room = roomUsers.find(room => room.ID === roomID);

  const currentAdmin = room.users[0];

  h1.textContent = `Admin ${currentAdmin}`;

  socket.emit("roomAdmin", { currentAdmin, roomID });
}

socket.on("roomAdmin", (roomData) => {
  console.log("roomData", roomData.users);
  console.log("roomData id", roomData.ID);

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
      avatar: avatarsrc
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
  // element.textContent = `${msg.message} `;
  // element.dataset.username = `${msg.username}`

  element.innerHTML = `
          <div>
             <img src="${msg.avatar}" alt="${msg.avatar} icon">
          </div>
          <p data-username="${msg.username}">${msg.message}</p>
         `


  // haal de data-room attribuut op van de parent ul om te bepalen in welke chatroom het bericht hoort
  const room = messages.getAttribute("data-room");
  if (msg.room === room) {
    console.log("element", element);
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

  // img.src = msg.gifMessage;
  // li.dataset.username = `${msg.userName}`
  // li.classList.add("gif")

  li.innerHTML = `
  <div>
    <img src="./images/girl-avatar-2.svg" alt="">
  </div>
  <div data-username="${msg.userName}">
  <img src="${msg.gifMessage}" alt="">
  </div>
  `
  // li.appendChild(img);

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

// const iframe = document.querySelector("header div iframe");
// const streamStart = document.querySelector("header div button");
// const streamStop = document.querySelector("header section > button:first-of-type");
// const roomLinkbutton = document.querySelector("header section > button:last-of-type");

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

    } else {
      console.log("Ongeldige YouTube-video-URL");
    }
  }

  function onPlayerReady(event) {
    console.log('player ready!');
    player = event.target;
    streamStart.addEventListener('click', playYTVideo);
  }

  videoSendLinkbutton.addEventListener("click", () => {
    streamStart.classList.add("admin")
    streamStop.classList.remove('admin')

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
      console.log("Hi yt");
    };
  })

  function onPlayerStateChange() {
    console.log('Player state has changed');
  }

  function stopVideo() {
    player.stopVideo();
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
      // player.stopVideo();

      console.log("play video");
    };
  })

})