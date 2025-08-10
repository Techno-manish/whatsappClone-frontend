export const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diff = now - date;

  // Same day
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  // Within a week
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }

  // Older
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

export const formatConversationTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const now = new Date();

  // Same day
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  // Within a week
  const diff = now - date;
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }

  // Older
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

export const groupMessagesByDate = (messages) => {
  const groups = [];
  let currentGroup = null;

  messages.forEach((message) => {
    const messageDate = new Date(message.timestamp * 1000);
    const dateKey = messageDate.toDateString();

    if (!currentGroup || currentGroup.date !== dateKey) {
      currentGroup = {
        date: dateKey,
        label: formatDateLabel(messageDate),
        messages: [],
      };
      groups.push(currentGroup);
    }

    currentGroup.messages.push(message);
  });

  return groups;
};

const formatDateLabel = (date) => {
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return "Today";
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
