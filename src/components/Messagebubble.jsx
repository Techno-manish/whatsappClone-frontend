import { formatMessageTime } from "../utils/dateUtils";
import MessageStatus from "./MessageStatus";

const MessageBubble = ({ message }) => {
  const isFromBusiness = message.isFromBusiness;
  const time = formatMessageTime(message.timestamp);

  return (
    <div
      className={`flex mb-2 ${
        isFromBusiness ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[75%] sm:max-w-[65%] rounded-lg px-3 py-2 relative shadow-sm ${
          isFromBusiness
            ? "bg-green-100 text-gray-900 rounded-br-none"
            : "bg-white text-gray-900 rounded-bl-none"
        }`}
      >
        {/* Message content with better spacing */}
        <div className="whitespace-pre-wrap break-words text-[14px] leading-5 pr-12">
          {message.messageBody}
        </div>

        {/* Enhanced time and status positioning */}
        <div className="flex items-center justify-end absolute bottom-1 right-2 gap-1">
          <span className="text-xs text-gray-500 select-none">{time}</span>
          <MessageStatus
            status={message.status}
            isFromBusiness={isFromBusiness}
          />
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
