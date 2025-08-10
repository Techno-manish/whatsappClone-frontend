import { useState } from "react";
import {
  FaPaperPlane,
  FaPaperclip,
  FaSmile,
  FaMicrophone,
} from "react-icons/fa";

const MessageInput = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim() || sending || disabled) return;

    try {
      setSending(true);
      await onSendMessage(message.trim());
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-4 bg-gray-50 border-t border-gray-200">
      <div className="flex items-end space-x-3">
        {/* Attachment button */}
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors duration-150"
          disabled={disabled}
        >
          <FaPaperclip className="w-5 h-5" />
        </button>

        {/* Enhanced message input */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message"
            disabled={disabled || sending}
            rows={1}
            className="w-full px-4 py-3 pr-12 bg-white rounded-lg border-none focus:outline-none resize-none text-sm leading-5 shadow-sm"
            style={{ minHeight: "40px", maxHeight: "120px" }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height =
                Math.min(e.target.scrollHeight, 120) + "px";
            }}
          />

          {/* Emoji button */}
          <button
            type="button"
            className="absolute right-3 bottom-2 text-gray-500 hover:text-gray-700 transition-colors duration-150"
            disabled={disabled}
          >
            <FaSmile className="w-5 h-5" />
          </button>
        </div>

        {/* Enhanced send/microphone button */}
        {message.trim() ? (
          <button
            onClick={handleSubmit}
            disabled={sending || disabled}
            className="w-10 h-10 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors duration-150 shadow-sm"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FaPaperPlane className="w-4 h-4 text-white ml-0.5" />
            )}
          </button>
        ) : (
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors duration-150"
            disabled={disabled}
          >
            <FaMicrophone className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageInput;
