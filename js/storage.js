// LocalStorage Manager for Chat Messages
class ChatStorage {
    constructor(storageKey = 'x7-chat-messages') {
        this.storageKey = storageKey;
    }
    
    // Save messages to localStorage
    saveMessages(messages) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(messages));
            return true;
        } catch (error) {
            console.error('Error saving messages:', error);
            return false;
        }
    }
    
    // Load messages from localStorage
    loadMessages() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading messages:', error);
            return [];
        }
    }
    
    // Add a new message
    addMessage(message) {
        const messages = this.loadMessages();
        messages.push(message);
        this.saveMessages(messages);
        return messages;
    }
    
    // Clear all messages
    clearMessages() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Error clearing messages:', error);
            return false;
        }
    }
    
    // Get message count
    getMessageCount() {
        return this.loadMessages().length;
    }
}

// Initialize storage
const storage = new ChatStorage();