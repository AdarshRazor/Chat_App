import React, { useContext } from 'react'
import { ChatContext } from '../../context/ChatContext'
import '../styles/chat.css'
import { Container, Stack } from 'react-bootstrap';
import userChat from '../userChat';
import { AuthContext } from '../../context/AuthContext';

function Chat() {

  const { user } = useContext(AuthContext)

  const { userChats, isUserChatsLoading, userChatsError } = useContext(ChatContext)

  console.log("UserChats: ", userChats);

  return (
    <Container className='m-3'>
      {userChats?.length < 1 ? null : (
        <Stack direction='horizontal' gap={4} className='align=items-start'>
          <Stack className='messages-box flex-grow-0 pe-3' gap={3}>
            {isUserChatsLoading && <p>Loading chats ..</p>}
            {userChats?.map((chat,index)=>{
              return(
                <div key={index}>
                  <userChat chat={chat} user={user}/>
                </div>
              )
            })}
            </Stack>
          <p>ChatBox</p>
        </Stack>
      )
      }
    </Container>
  )
}

export default Chat