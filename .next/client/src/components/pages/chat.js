import React, { useContext } from 'react'
import { ChatContext } from '../../context/ChatContext'
import '../styles/chat.css'
import { Container, Stack } from 'react-bootstrap';
import UserChat from '../userChat';
import { AuthContext } from '../../context/AuthContext';
import PotentialChats from '../PotentialChats';
import ChatBox from '../ChatBox';

function Chat() {

  const { user } = useContext(AuthContext)

  const { userChats, isUserChatsLoading, updateCurrentChat } = useContext(ChatContext)

  return (
    <Container className='m-3'>
      <PotentialChats/>
      {userChats?.length < 1 ? null : (
        <Stack direction='horizontal' gap={4} className='align=items-start'>
          <Stack className='messages-box flex-grow-0 pe-3' gap={3}>
            {isUserChatsLoading && <p>Loading chats ..</p>}
            {userChats?.map((chat,index)=>{
              return(
                // here we bringing the UserChat component
                <div key={index} onClick={()=> updateCurrentChat(chat)}>
                  <UserChat chat={chat} user={user}/>
                </div>
              )
            })}
            </Stack>
          <ChatBox/>
        </Stack>
      )
      }
    </Container>
  )
}

export default Chat