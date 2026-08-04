// Chat Forum System
class ChatForum {
    constructor() {
        this.messagesContainer = document.getElementById('chat-messages');
        this.messageInput = document.getElementById('message-input');
        this.storage = new ChatStorage();
        
        this.init();
    }
    
    init() {
        // Load existing messages
        this.loadMessages();
        
        // Set up event listeners
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Scroll to bottom on load
        this.scrollToBottom();
    }
    
    loadMessages() {
        const messages = this.storage.loadMessages();
        
        // Clear existing messages except system message
        const systemMessage = this.messagesContainer.querySelector('.system-message');
        this.messagesContainer.innerHTML = '';
        if (systemMessage) {
            this.messagesContainer.appendChild(systemMessage);
        }
        
        // Display loaded messages
        messages.forEach(msg => {
            this.displayMessage(msg, false);
        });
    }
    
    sendMessage() {
        const messageText = this.messageInput.value.trim();
        
        if (!messageText) {
            return;
        }
        
        // Generate username
        const username = this.generateUsername();
        
        // Create message object
        const message = {
            id: Date.now(),
            username: username,
            text: messageText,
            timestamp: new Date().toLocaleTimeString('ar-SA')
        };
        
        // Save to storage
        this.storage.addMessage(message);
        
        // Display message
        this.displayMessage(message, true);
        
        // Clear input
        this.messageInput.value = '';
        this.messageInput.focus();
        
        // Scroll to bottom
        this.scrollToBottom();
    }
    
    displayMessage(message, isNew = false) {
        const messageEl = document.createElement('div');
        messageEl.className = 'message';
        
        const contentEl = document.createElement('div');
        contentEl.className = 'message-content';
        
        const userEl = document.createElement('div');
        userEl.className = 'message-user';
        userEl.textContent = `👤 ${message.username}`;
        
        const textEl = document.createElement('div');
        textEl.className = 'message-text';
        textEl.textContent = message.text;
        
        const timeEl = document.createElement('div');
        timeEl.className = 'message-time';
        timeEl.textContent = `⏰ ${message.timestamp}`;
        
        contentEl.appendChild(userEl);
        contentEl.appendChild(textEl);
        contentEl.appendChild(timeEl);
        messageEl.appendChild(contentEl);
        
        this.messagesContainer.appendChild(messageEl);
        
        if (isNew) {
            this.scrollToBottom();
        }
    }
    
    generateUsername() {
        const prefixes = ['User', 'Hacker', 'Admin', 'Cyber', 'Security'];
        const suffixes = Math.floor(Math.random() * 9999);
        return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffixes}`;
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 10);
    }
    
    clearAllMessages() {
        if (confirm('هل أنت متأكد من رغبتك في مسح جميع الرسائل؟')) {
            this.storage.clearMessages();
            this.loadMessages();
            alert('تم مسح جميع الرسائل');
        }
    }
}

// Global functions for HTML event handlers
let chatForum;

function sendMessage() {
    if (!chatForum) return;
    chatForum.sendMessage();
}

function clearChat() {
    if (!chatForum) return;
    chatForum.clearAllMessages();
}

// Initialize chat forum when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        chatForum = new ChatForum();
    });
} else {
    chatForum = new ChatForum();
}