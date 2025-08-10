import { formatConversationTime } from "../utils/dateUtils";

const ConversationItem = ({ conversation, isActive, onClick }) => {
  const { waId, contactName, lastMessage, lastTimestamp, unreadCount } =
    conversation;
  const time = formatConversationTime(lastTimestamp);

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-all duration-150 border-b border-gray-100 ${
        isActive ? "bg-gray-100 border-l-4 border-l-green-500" : ""
      }`}
      onClick={() => onClick(conversation)}
    >
      {/* Enhanced Avatar */}
      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium text-sm flex-shrink-0 mr-3 shadow-sm">
        {getInitials(contactName)}
      </div>

      {/* Enhanced Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3
            className={`truncate text-[16px] ${
              isActive
                ? "font-semibold text-gray-900"
                : "font-medium text-gray-900"
            } ${unreadCount > 0 ? "font-semibold" : ""}`}
          >
            {contactName}
          </h3>
          <span
            className={`text-xs flex-shrink-0 ml-2 ${
              unreadCount > 0 ? "text-green-600 font-medium" : "text-gray-500"
            }`}
          >
            {time}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p
            className={`text-sm truncate flex-1 pr-2 ${
              unreadCount > 0 ? "text-gray-900 font-medium" : "text-gray-600"
            }`}
          >
            {lastMessage}
          </p>

          {unreadCount > 0 && (
            <div className="bg-green-500 rounded-full min-w-[18px] h-[18px] flex items-center justify-center shadow-sm">
              <span className="text-xs text-white font-medium px-1">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
