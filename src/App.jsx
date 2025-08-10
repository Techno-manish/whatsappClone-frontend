import { useState, useEffect } from "react";
import ConversationList from "./components/ConversationList";
import ChatArea from "./components/ChatArea";
import socketService from "./services/socket";

function App() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    socketService.connect();

    // Handle responsive design
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
      socketService.disconnect();
    };
  }, []);

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    if (isMobile) {
      setShowChat(true);
    }
  };

  const handleBackToList = () => {
    if (isMobile) {
      setShowChat(false);
      setSelectedConversation(null);
    }
  };

  const handleMessageSent = () => {
    // Could refresh conversation list or handle real-time updates here
  };

  // Mobile view: show either conversation list or chat
  if (isMobile) {
    return (
      <div className="h-screen bg-whatsapp-gray overflow-hidden">
        {showChat ? (
          <div className="h-full flex flex-col">
            <button
              onClick={handleBackToList}
              className="md:hidden p-2 text-whatsapp-green hover:bg-whatsapp-gray-light"
            >
              ← Back
            </button>
            <ChatArea
              selectedConversation={selectedConversation}
              onMessageSent={handleMessageSent}
            />
          </div>
        ) : (
          <ConversationList
            selectedConversation={selectedConversation}
            onConversationSelect={handleConversationSelect}
          />
        )}
      </div>
    );
  }

  // Desktop view: show both panels
  return (
    <div className="h-screen bg-whatsapp-gray overflow-hidden">
      <div className="h-full flex">
        <ConversationList
          selectedConversation={selectedConversation}
          onConversationSelect={handleConversationSelect}
        />
        <ChatArea
          selectedConversation={selectedConversation}
          onMessageSent={handleMessageSent}
        />
      </div>
    </div>
  );
}

export default App;
