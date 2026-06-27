const username = "Anon_" + Math.floor(1000 + Math.random() * 9000);
const chatRoomTopic = "superonly_matrix_global_channel_99812";
const publicBrokerUrl = "wss://broker.hivemq.com:8884/mqtt";
const client = mqtt.connect(publicBrokerUrl);

const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('chat-status');
const messagesContainer = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-btn');

client.on('connect', () => {
    statusDot.className = "inline-block w-2 h-2 rounded-full bg-emerald-400";
    statusText.innerText = username;
    statusText.className = "text-xs text-emerald-400 font-mono";

    messageInput.disabled = false;
    sendButton.disabled = false;

    client.subscribe(chatRoomTopic);
});

client.on('error', (err) => {
    statusDot.className = "inline-block w-2 h-2 rounded-full bg-rose-500";
    statusText.innerText = "Offline";
    statusText.className = "text-xs text-rose-500 font-mono";
    console.error(err);
});

client.on('message', (topic, payload) => {
    if (topic === chatRoomTopic) {
        try {
            const data = JSON.parse(payload.toString());
            renderBubble(data);
        } catch (e) {
            console.error("Payload parse error");
        }
    }
});

function sendPayload() {
    const txt = messageInput.value.trim();
    if (!txt) return;

    const pack = {
        user: username,
        msg: txt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    client.publish(chatRoomTopic, JSON.stringify(pack));
    messageInput.value = "";
}

function renderBubble(data) {
    const isMe = data.user === username;
    const bubbleWrapper = document.createElement('div');
    bubbleWrapper.className = `flex flex-col w-full max-w-[85%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`;

    bubbleWrapper.innerHTML = `
        <span class="text-[10px] text-slate-400 font-medium px-1 mb-0.5">${isMe ? 'You' : data.user} • ${data.timestamp}</span>
        <div class="px-3 py-2 rounded-2xl text-sm break-all shadow ${
            isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'
        }">
            ${sanitize(data.msg)}
        </div>
    `;

    messagesContainer.appendChild(bubbleWrapper);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sanitize(str) {
    return str.replace(/[&<>'"]/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[char] || char));
}

sendButton.addEventListener('click', sendPayload);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendPayload();
});
