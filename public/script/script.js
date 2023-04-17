const messages = document.querySelector('section ul');

const input = document.querySelector('#message-input');
const sendMessage = document.querySelector('#message-button');
const usernameInput = document.querySelector('#username-input');
const loggin= document.querySelector('main section:first-of-type')
const chatScreen= document.querySelector('main section:last-of-type')
const logginButton = document.querySelector('main section:first-of-type > button')

chatScreen.classList.add("hidden");

// // Annuleer the enter event on the input
usernameInput.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      sendMessage.click();
    }
});

logginButton.addEventListener('click' , () => {
    loggin.classList.add("hidden");
    chatScreen.classList.remove("hidden");
    socket.emit('focus', true); // Verzend de focus class naar andere clients
});


input.addEventListener('input', () => {
    const inputValue = input.value;
    // Doe hier iets met de waarde van het invoerveld
    console.log(inputValue);
    chatScreen.classList.add('focus');
    socket.emit('focus', true); // Verzend de focus class naar andere clients
});


sendMessage.addEventListener('click', (event) => {
    chatScreen.classList.remove('focus')
    socket.emit('focus', false); // Verzend de focus class naar andere clients

    event.preventDefault();
    if (input.value) {

        const chat ={
            username: usernameInput.value,
            message: input.value
        }

        socket.emit('chat message', chat);
        input.value = '';
    }
});

socket.on('chat message', (msg) => {
    console.log('chat message: ', msg.message);
    console.log(chatScreen);

    const element = document.createElement('li');
    element.textContent = ` ${msg.username}: ${msg.message} `;
    messages.appendChild(element);
    messages.scrollTop = messages.scrollHeight;

    if (msg.username === usernameInput.value) {
        element.classList.add('message');
    }

});





socket.on('focus', (hasFocus) => {
    if (hasFocus) {
        chatScreen.classList.add('focus');
    } else {
        chatScreen.classList.remove('focus');
    }
});
