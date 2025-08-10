import { useState, useEffect, useRef } from "react";
import { FaPhone, FaVideo, FaSearch, FaEllipsisV } from "react-icons/fa";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import DateSeparator from "./DateSeparator";
import { messageAPI } from "../services/api";
import { groupMessagesByDate } from "../utils/dateUtils";
import socketService from "../services/socket";

const ChatArea = ({ selectedConversation, onMessageSent }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages();
      markAsRead();
      socketService.joinConversation(selectedConversation.waId);
    }

    return () => {
      if (selectedConversation) {
        socketService.leaveConversation(selectedConversation.waId);
      }
    };
  }, [selectedConversation]);

  useEffect(() => {
    const handleNewMessage = (message) => {
      if (message.waId === selectedConversation?.waId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleMessageUpdate = (updatedMessage) => {
      if (updatedMessage.waId === selectedConversation?.waId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.messageId === updatedMessage.messageId ? updatedMessage : msg
          )
        );
      }
    };

    if (socketService.isConnected()) {
      socketService.onNewMessage(handleNewMessage);
      socketService.onMessageUpdate(handleMessageUpdate);
    }

    return () => {
      socketService.removeListeners();
    };
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!selectedConversation) return;

    try {
      setLoading(true);
      setError(null);
      const response = await messageAPI.getConversation(
        selectedConversation.waId
      );
      setMessages(response.data || []);
    } catch (error) {
      console.error("Error loading messages:", error);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    if (!selectedConversation) return;

    try {
      await messageAPI.markAsRead(selectedConversation.waId);
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleSendMessage = async (messageBody) => {
    if (!selectedConversation || !messageBody.trim()) return;

    try {
      const response = await messageAPI.sendMessage(
        selectedConversation.waId,
        messageBody,
        selectedConversation.contactName
      );

      if (response.success && response.data) {
        setMessages((prev) => [...prev, response.data]);
      }

      if (onMessageSent) {
        onMessageSent(response.data);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!selectedConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          {/* Improved empty state with better styling */}
          <div className="w-32 h-32 mx-auto mb-8 relative">
            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
              <svg viewBox="0 0 303 172" className="w-20 h-20 text-gray-400">
                <path
                  fill="currentColor"
                  d="M229.9 147.2c.1-2.1.1-4.4.1-6.8c0-21.3-8.6-41.9-23.8-57.1c-15.2-15.2-35.8-23.8-57.1-23.8s-41.9 8.6-57.1 23.8c-15.2 15.2-23.8 35.8-23.8 57.1c0 2.4 0 4.7.1 6.8H52.2c-2.6 0-4.7 2.1-4.7 4.7v30.8c0 2.6 2.1 4.7 4.7 4.7h225.6c2.6 0 4.7-2.1 4.7-4.7v-30.8c0-2.6-2.1-4.7-4.7-4.7h-47.9zM149.1 68.9c35.2 0 71.8 21.3 81.4 53.3H67.7c9.6-32 46.2-53.3 81.4-53.3z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-[32px] font-light text-gray-600 mb-3">
            WhatsApp Web
          </h2>
          <p className="text-gray-500 text-[14px] mb-2">
            Send and receive messages without keeping your phone online.
          </p>
          <p className="text-gray-500 text-[14px]">
            Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
          </p>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Enhanced Chat Header */}
      <div className="p-4 bg-gray-100 border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Improved avatar with better colors */}
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium text-sm">
              {getInitials(selectedConversation.contactName)}
            </div>
            <div>
              <h2 className="font-medium text-gray-900 text-[16px]">
                {selectedConversation.contactName}
              </h2>
              {/* Better status indicator */}
              <p className="text-sm text-gray-500">online</p>
            </div>
          </div>

          {/* Improved header icons with better spacing and hover effects */}
          <div className="flex items-center space-x-6 text-gray-600">
            <FaSearch className="w-5 h-5 cursor-pointer hover:text-gray-800 transition-colors duration-150" />
            <FaPhone className="w-5 h-5 cursor-pointer hover:text-gray-800 transition-colors duration-150" />
            <FaVideo className="w-5 h-5 cursor-pointer hover:text-gray-800 transition-colors duration-150" />
            <FaEllipsisV className="w-5 h-5 cursor-pointer hover:text-gray-800 transition-colors duration-150" />
          </div>
        </div>
      </div>

      {/* Enhanced Messages Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-cover bg-center"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f2f5' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundColor: "#efeae2",
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-4"></div>
              <p className="text-gray-600 text-sm">Loading messages...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center bg-white p-6 rounded-lg shadow-sm">
              <div className="text-red-500 mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadMessages}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-150"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <>
            {messageGroups.map((group, index) => (
              <div key={group.date}>
                <DateSeparator label={group.label} />
                {group.messages.map((message) => (
                  <MessageBubble
                    key={message.messageId || message._id}
                    message={message}
                  />
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} disabled={loading} />
    </div>
  );
};

export default ChatArea;
