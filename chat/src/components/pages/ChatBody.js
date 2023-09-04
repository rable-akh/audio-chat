import React from 'react'
import {useNavigate} from "react-router-dom"

const ChatBody = ({socket, messages, typingStatus, lastMessageRef, selectedUser}) => { 
  const navigate = useNavigate()

  const userD = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):{}

  const handleLeaveChat = () => {
    socket.emit("userLeave", userD)
    socket.close()
    localStorage.removeItem("user")
    navigate("/login")
    // window.location.reload()
  }
  
  return (
    <>
      <header className='chat__mainHeader'>
        <p>Hangout with {selectedUser?.user}</p>
        <button className='leaveChat__btn' onClick={handleLeaveChat}>LEAVE CHAT</button>
      </header>

      <div className='message__container'>
        {messages.map((message, key) => (
          message.message.name === userD?.user ? (
            <div className="message__chats" key={key}>
          <p className='sender__name'>You</p>
          <div className='message__sender'>
              <p>{message.message.text}</p>
          </div>
        </div>
          ): (
            <div className="message__chats" key={key}>
          <p>{message.message.name}</p>
          <div className='message__recipient'>
              <p>{message.message.text}</p>
          </div>
        </div>
          )
          ))}
          
        <div className='message__status'>
          <p>{typingStatus}</p>
        </div>
        <div ref={lastMessageRef} />   
      </div>
    </>
  )
}


export default ChatBody