import React, { useEffect, useState } from 'react'
import { socketServer } from '../../config'
import ListGroup from 'react-bootstrap/ListGroup';
import axios from "axios"
import ChatBox from '../utility/chatBox';

export default function Main({socket}) {

  const [users, setUsers] = useState([])

  const [toUser, setToUser] = useState({})
  const [showchat, setShowChat] = useState(false)

  const [messages, setMessages] = useState([]);

  const getUser = async () => {
    axios.get('http://localhost:4000/users')
    .then((res) => {
      if(res.status===200){
        setUsers(res.data)
      }
    })
    .catch((e) => {

    })
  }
  useEffect(() => { 
    socket.on('connect', () => {
      console.log("connected");
    });

    getUser()

    socket.on("disconnect", () => {
      const currentUser = JSON.parse(localStorage.getItem("currentuser"))
      socket.emit("user disconnect", currentUser)
    });

    socket.on("private message response", (msg) => {
      messages.push([...messages, msg])
    })

    return () => {
      socket.off("connected");
      socket.off("private message response")
      socket.off('disconnect');
    };
  },[socket, messages])  


  const callUser = async (usr) => {

  }

  const sendMessage = async (e) => {
    e.preventDefault()
    socket.emit("private message", e.target.msg.value)
  }

  const messageUser = async (row) => {
    setToUser(row)
    setShowChat(true)
  }

  const messageClose = async () => {
    setShowChat(false)
  }

  return (
    <div>
      <ListGroup>
        {
          users.map((row, index) => (
            <ListGroup.Item key={index}>
              <div className='d-flex justify-content-between'>
                <div>ID: {row?.id} | Name: {row?.user}</div>
                <div>
                  <button type="button" onClick={() => {callUser(row)}} className="btn btn-primary">Call</button>
                  <button type="button" onClick={() => {messageUser(row)}} className="btn btn-secondary">Message</button>
                </div>
              </div>
            </ListGroup.Item>
          ))
        }
      </ListGroup>
      <ChatBox show={showchat} setShow={messageClose} user={toUser} send={sendMessage} msgLists={messages}/>
    </div>
  )
}
