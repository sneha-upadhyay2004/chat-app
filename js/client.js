// Connect to the server
const socket = io('http://localhost:8000');

// DOM elements
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

// Function to append messages to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
};

// Send message on form submit
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});

// Prompt for user's name and emit the new-user-joined event
const name = prompt('Enter your name to join');
socket.emit('new-user-joined', name);

// Listen for user-joined event from the server
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});

// Listen for receive event from the server
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

// Listen for left event from the server
socket.on('left', name => {
    append(`${name} left the chat`, 'right');
});
