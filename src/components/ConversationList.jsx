import { useState, useEffect } from "react";
import { FaSearch, FaComment, FaEllipsisV } from "react-icons/fa";
import ConversationItem from "./ConversationItem";
import { messageAPI } from "../services/api";

const ConversationList = ({ selectedConversation, onConversationSelect }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await messageAPI.getConversations();
      setConversations(response.data || []);
    } catch (error) {
      console.error("Error loading conversations:", error);
      setError("Failed to load conversations because of renderer, retry after one minute.");
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.waId.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="w-full md:w-1/3 bg-white border-r border-gray-300 flex flex-col h-full">
        {/* Enhanced loading header */}
        <div className="p-4 bg-gray-100 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium text-sm">ME</span>
              </div>
              <h1 className="text-lg font-medium text-gray-900">My WhatsApp</h1>
            </div>
            <div className="flex space-x-3">
              <FaComment className="w-5 h-5 text-gray-600" />
              <FaEllipsisV className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Loading state */}
        <div className="flex items-center justify-center p-8 flex-1">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-4"></div>
            <p className="text-gray-600 text-sm">Loading conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full md:w-1/3 bg-white border-r border-gray-300 flex flex-col h-full">
        {/* Error header */}
        <div className="p-4 bg-gray-100 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium text-sm">ME</span>
              </div>
              <h1 className="text-lg font-medium text-gray-900">My WhatsApp</h1>
            </div>
          </div>
        </div>

        {/* Error state */}
        <div className="flex items-center justify-center p-8 flex-1">
          <div className="text-center bg-red-50 p-6 rounded-lg border border-red-200">
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
            <p className="text-red-700 mb-4 font-medium">Error: {error}</p>
            <button
              onClick={loadConversations}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-150"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/3 bg-white border-r border-gray-300 flex flex-col h-full">
      {/* Enhanced Header */}
      <div className="p-4 bg-gray-100 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium text-sm">ME</span>
            </div>
            <h1 className="text-lg font-medium text-gray-900">My WhatsApp</h1>
          </div>
          <div className="flex space-x-3">
            <FaComment className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors duration-150" />
            <FaEllipsisV className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors duration-150" />
          </div>
        </div>
      </div>

      {/* Enhanced Search */}
      <div className="p-3 bg-white border-b border-gray-100">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all duration-150"
          />
        </div>
      </div>

      {/* Enhanced Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaComment className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-center text-gray-600 font-medium mb-2">
              {searchTerm ? "No conversations found" : "No conversations yet"}
            </p>
            <p className="text-center text-sm text-gray-500">
              {searchTerm
                ? "Try a different search term"
                : "Start a new conversation to get started"}
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.waId}
              conversation={conversation}
              isActive={selectedConversation?.waId === conversation.waId}
              onClick={onConversationSelect}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;
