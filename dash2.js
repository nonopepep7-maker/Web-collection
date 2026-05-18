const chatBox =document.getElementById("user2-chat");
const messageInput = document.getElementById("user2-input");

function sendMessage() {
    const text = messageInput.value.trim();
    if (text !== "") {
        appendMessage(text, 'outgoing');
        const messageData = { text: text, time: Date.now() };
        localStorage.setItem('msg_to_user1', JSON.stringify(messageData));
        messageInput.value = '';
    }
}
window.addEventListener('storage', function(e) {
    if (e.key === 'msg_to_user2' && e.newValue) {
        const received = JSON.parse(e.newValue);
        appendMessage(received.text, 'incoming');
        localStorage.removeItem('msg_to_user2');
    }
});

function appendMessage(text, type) {
    const msg = document.createElement('div');
    msg.classList.add('message', type);
    msg.innerText = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

messageInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });