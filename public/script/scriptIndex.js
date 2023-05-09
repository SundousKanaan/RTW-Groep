// client.js

const socket = io();

const roomNameInput = document.querySelector('#roomname-input');
const startRoomButton = document.querySelector('main.loggin section a');
const checkRoomButton = document.querySelector('main.loggin section button');
const pNote = document.querySelector("main.loggin section > p")

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
  roomNameInput.classList.remove("badName")
  roomNameInput.classList.remove("goodName")
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
      
      checkRoomButton.classList.add("checking")
      console.log(checkRoomButton);
      setTimeout(() => {
        checkRoomButton.classList.remove("checking")
        
        roomNameInput.classList.add("goodRoomName")
        roomNameInput.classList.remove("badRoomName")
        startRoomButton.classList.add("startRoom")
        checkRoomButton.classList.add("startRoom")
        
      }, 3000);



      startRoomButton.href = "/room?room=" + roomNameInput.value;
    }
  }
})

socket.on('checkRoom2', (data) => {
  console.log("openRoomName:", data);
  console.log("You can't open room with name", data.roomname);

  checkRoomButton.classList.add("checking")
  console.log(checkRoomButton);
  setTimeout(() => {
    checkRoomButton.classList.remove("checking")
    
  roomNameInput.classList.add("badRoomName")
  roomNameInput.classList.remove("goodRoomName")

  roomNameInput.value=""

  console.log(pNote);

  pNote.innerHTML = `
  The room "<strong>${data.roomname}</strong>" is all open. Choose another room name
  `

  pNote.classList.add("check")
  startRoomButton.classList.remove("startRoom")
  checkRoomButton.classList.remove("startRoom")
}, 3000);
});



