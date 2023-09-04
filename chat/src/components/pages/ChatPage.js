import axios from 'axios'
import React, { useEffect, useState, useRef} from 'react'
import { addAnswer, madeAnswer, peerConnect } from '../../cores/RTCCore'
import ChatBar from './ChatBar'
import ChatBody from './ChatBody'
import ChatFooter from './ChatFooter'

const ChatPage = ({socket}) => { 
  const [messages, setMessages] = useState([])
  const [typingStatus, setTypingStatus] = useState("")
  const [isAlreadyCalling, setIsAlreadyCalling] = useState(false)
  const lastMessageRef = useRef(null);

  const audioRef = useRef(null);
  const remoteStreamRef = useRef(null);
  
  const [calling, setCalling] = useState(false)

  const [users, setUsers] = useState([])
  const [newMsgFrom, setNewMsgFrom] = useState(null)

  // const [bodyShow, setBodyShow] = useState(false);

  const [selectUser, setSelectUser] = useState(null)
  const userD = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):{}

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
  useEffect(()=> {
    getUser()
    socket.on("activeUserResponse", data => setUsers(data))

    socket.on("userLeave", (data) => {
        console.log(data);
    })

    socket.connect()
  }, [socket])

  useEffect(() => {
    const rs = new MediaStream()
    remoteStreamRef.current = rs
    var rd = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):{}
    socket.auth = {user: rd.user}
    // socket.on("connect", () => {
    //   console.log(socket.id);
    // });
    socket.connect()
  },[])

  useEffect(()=> {
    
    socket.on("pvtMsgResponse", (data) => {
      setMessages([...messages, data])
    })
    socket.connect()
  }, [socket, messages])

  useEffect(()=> {
    socket.on("typingResponse", data => setTypingStatus(data))

    socket.on("newMessages", (data) => {
      setNewMsgFrom(data)
    })
    
    socket.on("disconnect", data => console.log(data))

    
    socket.on("invited", (data) => {
      socket.emit("joinUser", data)
    })
    
    socket.connect()
  }, [socket])

  useEffect(() => {
    // audioRef.current.play();
    socket.on('call-made', (data) => {
      audioRef.current.play();
      const constraints = {
        'video': false,
        'audio': true
      }
      navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
          console.log('Got MediaStream:', stream);
          stream.getTracks().forEach(track => peerConnect().addTrack(track, stream));
          madeAnswer(socket, data)
          setCalling(true)
          // audioRef.current.play();
      })
      .catch(error => {
          alert("You have not any devices.")
          console.error('Error accessing media devices.', error);
      });
    })

    socket.on('answer-made', (data) => {
      addAnswer(socket, data, isAlreadyCalling, setIsAlreadyCalling)
      // audioRef.current.pause();
    })

    socket.connect()
  }, [socket])

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  const handleSelected = (d) => {
    setMessages([])
    setSelectUser(d)
    socket.emit("create", {room: d._id+userD._id, userId: d._id, withId: userD._id, socketId: socket.id})
    console.log(d);
    
    socket.connect()
    // socket.on("invited", (data) => {
      
    // })

    axios.get(`http://localhost:4000/messages/${d._id}/${userD._id}`)
    .then((d) => {
      console.log(d.data);
      setMessages(d.data.data)
    })
    .catch((e) => {
      console.log(e);
    })
  }

  return (
    <div className="chat">
      <ChatBar socket={socket} selectedUser={handleSelected} users={users} setUsers={setUsers} newmsgfrom={newMsgFrom}/>
      <div className='chat__main'>
        {
          selectUser&&(
            <>
              <ChatBody socket={socket} selectedUser={selectUser} messages={messages} typingStatus={typingStatus} lastMessageRef={lastMessageRef}/>
              <ChatFooter socket={socket} selectedUser={selectUser} calling={calling} setCalling={setCalling} audioRef={audioRef} remoteStreamRef={remoteStreamRef}/>
            </>
          )
        }
      <audio ref={audioRef}/>
      <audio ref={remoteStreamRef}/>
      </div>
    </div>
  )
}

export default ChatPage