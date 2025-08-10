import { FaCheck, FaCheckDouble } from "react-icons/fa";

const MessageStatus = ({ status, isFromBusiness }) => {
  if (!isFromBusiness) return null;

  const getStatusIcon = () => {
    switch (status) {
      case "sent":
        return <FaCheck className="w-3 h-3 text-gray-400" />;
      case "delivered":
        return <FaCheckDouble className="w-3 h-3 text-gray-400" />;
      case "read":
        return <FaCheckDouble className="w-3 h-3 text-blue-400" />;
      default:
        return <FaCheck className="w-3 h-3 text-gray-400" />;
    }
  };

  return (
    <div className="flex items-center justify-end ml-1">{getStatusIcon()}</div>
  );
};

export default MessageStatus;
