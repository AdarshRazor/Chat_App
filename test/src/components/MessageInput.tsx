import React, { useState } from 'react';

interface MessageInputProps {
  onSend: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSend(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSend} className="flex p-4 border-t">
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 p-2 border rounded"
      />
      <button type="submit" className="ml-2 bg-blue-600 text-white px-4 py-2 rounded">
        Send
      </button>
    </form>
  );
};

export default MessageInput;
