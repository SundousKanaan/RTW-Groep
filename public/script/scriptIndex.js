const socket = io();

// client.js
const roomNameInput = document.querySelector('#roomname-input');
const roomLink = document.querySelector('main.loggin section a');
const makeroom = document.querySelector('main.loggin section button');
const pNote = document.querySelector("main.loggin section > p")


let openRoom = [];
console.log(openRoom);

roomNameInput.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    // makeroom.click();
  }
});

roomNameInput.addEventListener("input", () => {
  roomLink.classList.remove("startRoom")
  makeroom.classList.remove("startRoom")
  pNote.classList.remove("check")
})

makeroom.addEventListener('click', () => {
  const roomname = roomNameInput.value
  if (!openRoom.includes(roomname)) {
    openRoom.push(roomname);
    console.log("rooms", openRoom);
    socket.emit("checkRoom", {openRoom , roomname} );
  } else {
    console.log("the room is open");
    pNote.classList.add("check")
    roomLink.classList.remove("startRoom")
    makeroom.classList.remove("startRoom")
  }

})

socket.on('checkRoom', (data) => {
  console.log("server rooms:", roomNameInput.value);
  console.log("openRoomName:",data);

  let RoomsArray = data.roomsArray
  let roomName = data.openRoomName

  console.log("roomsArray", data.openRoomName);

    if (!RoomsArray[roomNameInput.value]) {
      console.log("yes, you kan make the room");

      roomLink.classList.add("startRoom")
      makeroom.classList.add("startRoom")

      roomLink.href = "/room?room=" + roomNameInput.value;
      console.log("roomLink", roomLink);

    }
})


