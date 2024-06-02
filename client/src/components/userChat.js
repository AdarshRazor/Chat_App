import React from 'react'
import { useFetchRecipientUser } from '../hooks/useFetchRecipient'
import { Stack } from 'react-bootstrap'
import Avatar from '../components/static/profile.gif'

function UserChat({ chat, user }) {
  const { recipientUser, error } = useFetchRecipientUser(chat, user)

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!recipientUser) {
    return <p>Loading...</p>;
  }

  return (
    <Stack direction='horizontal' gap={3} className='user-card align-items-center p-2 justify-content-between' role='button'>
      <div className='d-flex'>
        <div className='me-2'>
          <img src={recipientUser?.profilePic || Avatar} alt={recipientUser?.name} className='rounded-circle' style={{ width: '40px', height: '40px' }} />
        </div>
        <div className='text-content'>
          <div className='name'>{recipientUser?.name}</div>
          <div className='text'>Hi There 😁</div>
        </div>
      </div>
      <div className='d-flex flex-column align-items-end'>
        <div className='date'>
          12/12/2022
        </div>
        <div className='this-user-notifications'>12</div>
        <span className='user-online'></span>
      </div>
    </Stack>
  )
}

export default UserChat
