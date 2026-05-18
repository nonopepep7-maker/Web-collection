const chatbox = document.getElementById('user1-chat');
const messageInput = document.getElementById('user1-input');

function sendMessage() {
    const text = messageInput.value.trim();
    if (text !== "") {
        appendMessage(text, 'outgoing')
        const messageData = { text: text, time: Date.now() };
        localStorage.setItem('msg_to_user2', JSON.stringify(messageData));
        messageInput.value = '';
    }
}

window.addEventListener('storage', function(e) {
    if (e.key === 'msg_to_user1' && e.newValue) {
        const received = JSON.parse(e.newValue);
        appendMessage(received.text, 'incoming');
        localStorage.removeItem('msg_to_user1');
    }
});

function appendMessage(text, type) {
    const msg = document.createElement('div');
    msg.classList.add('message', type);
    msg.innerText = text;
    chatbox.appendChild(msg);
    chatbox.scrollTop = chatbox.scrollHeight;
}

messageInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

