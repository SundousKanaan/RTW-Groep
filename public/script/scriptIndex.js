// client.js

const socket = io();

const roomNameInput = document.querySelector('#roomname-input');
const startRoomButton = document.querySelector('main.loggin section a');
const checkRoomButton = document.querySelector('main.loggin section button');
const pNote = document.querySelector("main.loggin section > p")


// let openRoom = [];
// console.log(openRoom);

roomNameInput.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    checkRoomButton.click();
  }
});

roomNameInput.addEventListener("input", () => {
  startRoomButton.classList.remove("startRoom")
  checkRoomButton.classList.remove("startRoom")
  pNote.classList.remove("check")
})

checkRoomButton.addEventListener('click', () => {
  const roomname = roomNameInput.value
  console.log(roomname);
    socket.emit("checkRoom", roomname );
})

socket.on('checkRoom', (data) => {
  console.log("server rooms:", roomNameInput.value);
  console.log("openRoomName:", data.log);
  
  const roomsIDs = data.roomUsers.map(roomUser => roomUser.ID);
  console.log("roomsIDs", roomsIDs)

  let roomName = data.roomname

  for (let i = 0; i < roomsIDs.length; i++) {
    if (roomsIDs[i] === roomNameInput.value) {
      console.log("yes, you kan make the room");

      pNote.classList.remove("check")
      startRoomButton.classList.add("startRoom")
      checkRoomButton.classList.add("startRoom")

      startRoomButton.href = "/room?room=" + roomNameInput.value;
    }
  }
})

socket.on('checkRoom2', (data) => {
  console.log("openRoomName:", data);
  console.log("openRoomName:", data.roomname);


  console.log("You can't open room with name", data.roomname);
  pNote.classList.add("check")
  startRoomButton.classList.remove("startRoom")
  checkRoomButton.classList.remove("startRoom")
});



