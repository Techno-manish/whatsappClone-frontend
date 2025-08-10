import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      timeout: 10000,
    });

    this.socket.on("connect", () => {
      console.log("✅ Connected to server");
      this.connected = true;
    });

    this.socket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
      this.connected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      this.connected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Join a specific conversation room
  joinConversation(waId) {
    if (this.socket?.connected) {
      this.socket.emit("join_conversation", waId);
    }
  }

  // Leave a conversation room
  leaveConversation(waId) {
    if (this.socket?.connected) {
      this.socket.emit("leave_conversation", waId);
    }
  }

  // Listen for new messages
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on("new_message", callback);
    }
  }

  // Listen for message updates
  onMessageUpdate(callback) {
    if (this.socket) {
      this.socket.on("message_update", callback);
    }
  }

  // Listen for messages read
  onMessagesRead(callback) {
    if (this.socket) {
      this.socket.on("messages_read", callback);
    }
  }

  // Remove listeners
  removeListeners() {
    if (this.socket) {
      this.socket.off("new_message");
      this.socket.off("message_update");
      this.socket.off("messages_read");
    }
  }

  isConnected() {
    return this.connected && this.socket?.connected;
  }
}

export default new SocketService();
