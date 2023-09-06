import React, { useCallback, useContext } from 'react'
import { ChatContext } from '../context/ChatContext'
import { AuthContext } from '../context/AuthContext'
import { Container, Stack } from 'react-bootstrap'
import UserCart from '../components/chats/UserChat'
import PotentialChats from '../components/chats/PotentialChats'
import ChatBox from '../components/chats/ChatBox'

const Chat = () => {
  const {userChats, isUserChatsLoading, userChatsError, updateCurrentChat} = useContext(ChatContext)
  const{user} = useContext(AuthContext);
  // console.log("userChat",userChats)
  return (
    <Container>
    <PotentialChats/>
      {userChats?.length < 1 ? null : 
      <Stack direction='horizontal' gap={4} className='align-items-start'>
        <Stack className='flex-grow-0 messages-box pe-3' gap={3}>
        {isUserChatsLoading && <p>Loading Chats</p>}
        {userChats?.map((chat,index)=>{
          return <div key={index} onClick={()=>updateCurrentChat(chat)}>
            <UserCart chat={chat} user={user}/>
          </div>
        })}

        </Stack>
        <ChatBox/>
      </Stack>}
    </Container>
  )
}



export default Chat