import React, { useEffect, useState } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import useSocket from '../hooks/useSocket';
import { Socket } from 'socket.io-client'; // Simplified import

interface Message {
  id: string;
  sender: string;
  content: string;
}

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const socket: Socket | null = useSocket(); // Simplified type

  useEffect(() => {
    if (!socket) return;
    socket.on('message', (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => {
      if (socket) {
        socket.off('message');
      }
    };
  }, [socket]);

  const handleSendMessage = (messageContent: string) => {
    if (!socket) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'Me',
      content: messageContent,
    };

    socket.emit('message', newMessage);

    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg.content}
            sender={msg.sender}
            isOwnMessage={msg.sender === 'Me'}
          />
        ))}
      </div>
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;