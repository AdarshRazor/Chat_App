import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Stack } from 'react-bootstrap';
import { ChatContext } from '../context/ChatContext'
import { useFetchRecipientUser } from '../hooks/useFetchRecipient'

function ChatBox() {
  const { user } = useContext(AuthContext);
  const { currentChat, messages, isMessagesLoading } = useContext(ChatContext);
  const { recipientUser } = useFetchRecipientUser(currentChat, user);

  // Check if messages are still loading
  if (!isMessagesLoading) {
    return <p style={{ textAlign: 'center', width: '100%' }}>Loading Chat ...</p>;
  }

  // Check if recipientUser is not available
  if (!recipientUser) {
    return <p style={{ textAlign: 'center', width: '100%' }}>No conversation selected yet ...</p>;
  }

  // Render chat header with recipientUser's name
  return (
    <>
      <Stack gap={4} className="chat-box">
        <div className='chat-header'>
          <strong>{recipientUser?.name}</strong>
        </div>
      </Stack>
    </>
  );
}

export default ChatBox;
