import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const messageAPI = {
  // Get all conversations
  getConversations: async () => {
    const response = await api.get("/messages/conversations");
    console.log("Fetched conversations:", response.data);
    return response.data;
  },

  // Get specific conversation messages
  getConversation: async (waId) => {
    const response = await api.get(`/messages/conversations/${waId}`);
    return response.data;
  },

  // Send a new message
  sendMessage: async (waId, messageBody, contactName) => {
    const response = await api.post("/messages/send", {
      waId,
      messageBody,
      contactName,
    });
    return response.data;
  },

  // Mark conversation as read
  markAsRead: async (waId) => {
    const response = await api.put(`/messages/conversations/${waId}/read`);
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get("/health");
    return response.data;
  },
};

export default api;
