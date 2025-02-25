import React from 'react';

interface MessageBubbleProps {
  message: string;
  sender: string;
  isOwnMessage: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, sender, isOwnMessage }) => {
  return (
    <div className={`mb-2 flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`p-2 rounded max-w-xs ${
          isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'
        }`}
      >
        <p className="text-sm">{message}</p>
        <span className="text-xs">{sender}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
