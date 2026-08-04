// Online Chat Functions with Firebase Realtime Database

let currentUser = null;
let messagesRef = null;

// Initialize chat when page loads
function initializeChat() {
    const userData = localStorage.getItem('x7_user');
    
    if (!userData) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }

    currentUser = JSON.parse(userData);
    messagesRef = firebase.database().ref('messages');

    // Display current user
    updateUserDisplay();

    // Listen for new messages in real-time
    loadMessagesFromDatabase();

    // Enable send button
    document.getElementById('message-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Update user display
function updateUserDisplay() {
    const userDisplay = document.getElementById('user-display');
    if (userDisplay) {
        userDisplay.innerHTML = `
            <span class="user-info">👤 ${currentUser.username}</span>
            <button class="logout-button" onclick="logoutUser()">تسجيل الخروج</button>
        `;
    }
}

// Send message to database
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();

    if (!messageText) {
        return;
    }

    // Check message length
    if (messageText.length > 500) {
        alert('⚠️ الرسالة طويلة جداً (الحد الأقصى 500 حرف)');
        return;
    }

    // Create message object
    const messageData = {
        uid: currentUser.uid,
        username: currentUser.username,
        text: messageText,
        timestamp: new Date().toISOString(),
        displayTime: formatTime(new Date())
    };

    // Send to Firebase
    messagesRef.push(messageData)
        .then(() => {
            messageInput.value = '';
            messageInput.focus();
        })
        .catch((error) => {
            console.error('❌ خطأ في إرسال الرسالة:', error);
            alert('❌ حدث خطأ في إرسال الرسالة');
        });
}

// Load messages from database in real-time
function loadMessagesFromDatabase() {
    const chatMessagesDiv = document.getElementById('chat-messages');

    // Clear existing messages
    chatMessagesDiv.innerHTML = `
        <div class="system-message">
            <p>🔓 مرحباً بك في منتدى X7 الأونلاين - شارك معرفتك وتعلم من الآخرين</p>
        </div>
    `;

    // Listen for all messages
    messagesRef.orderByChild('timestamp').on('child_added', (snapshot) => {
        const message = snapshot.val();
        const messageKey = snapshot.key;

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message';
        messageDiv.id = 'msg-' + messageKey;

        // Check if it's user's own message
        if (message.uid === currentUser.uid) {
            messageDiv.classList.add('own-message');
        }

        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="message-username">👤 ${message.username}</span>
                <span class="message-time">⏰ ${message.displayTime}</span>
            </div>
            <div class="message-content">
                ${escapeHtml(message.text)}
            </div>
        `;

        chatMessagesDiv.appendChild(messageDiv);

        // Scroll to bottom
        scrollToBottom();
    });

    // Listen for deleted messages
    messagesRef.on('child_removed', (snapshot) => {
        const messageKey = snapshot.key;
        const messageElement = document.getElementById('msg-' + messageKey);
        if (messageElement) {
            messageElement.remove();
        }
    });
}

// Format time
function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Scroll to bottom of chat
function scrollToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Clear all messages (admin function)
function clearChat() {
    if (confirm('⚠️ هل أنت متأكد من حذف جميع الرسائل؟ (لا يمكن التراجع عن هذا الإجراء)')) {
        messagesRef.remove()
            .then(() => {
                alert('✅ تم حذف جميع الرسائل');
                location.reload();
            })
            .catch((error) => {
                console.error('❌ خطأ:', error);
                alert('❌ حدث خطأ في حذف الرسائل');
            });
    }
}

// Logout user
function logoutUser() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
        firebase.auth().signOut()
            .then(() => {
                localStorage.removeItem('x7_user');
                window.location.href = 'login.html';
            })
            .catch((error) => {
                console.error('❌ خطأ في تسجيل الخروج:', error);
            });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Firebase to be ready
    if (typeof firebase !== 'undefined') {
        initializeChat();
    } else {
        console.error('❌ Firebase not loaded');
        alert('⚠️ حدث خطأ في تحميل النظام');
    }
});
