import React, {useState} from 'react'
import { callUser, hangup, peerConnect } from '../../cores/RTCCore'
import {Button, Modal} from 'react-bootstrap'

const ChatFooter = ({socket, selectedUser, calling, setCalling, audioRef, call, remoteStreamRef}) => {

    const userD = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):{}

    const [message, setMessage] = useState("")
    
    const handleTyping = () => socket.emit("typing", {to: selectedUser._id, msg: `${userD?.user} is typing`})
    const handleTypingStop = () => socket.emit("typing", {to: selectedUser._id, msg: ""})

    const handleSendMessage = (e) => {
        e.preventDefault()
        if(message.trim() && userD?.user) {
            socket.emit("privateMessage", 
                {
                    to: selectedUser?._id,
                    text: message, 
                    name: userD?.user, 
                    id: userD?._id,
                    socketID: socket.id
                }
            )
        }
        setMessage("")
    }

    const onHandleCall = (e) => {
        e.preventDefault()

        const constraints = {
            'video': false,
            'audio': true
        }
        // callUser(socket, selectedUser?._id, selectedUser?.user, userD?._id, userD?.user)
        // setCalling(true)
        navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            console.log('Got MediaStream:', stream);
            stream.getTracks().forEach(track => peerConnect().addTrack(track, stream) );
            callUser(socket, selectedUser?._id, selectedUser?.user, userD?._id, userD?.user, stream)
            setCalling(true)
            // audioRef.current.play();
        })
        .catch(error => {
            alert("You have not any devices.")
            console.error('Error accessing media devices.', error);
        });

        peerConnect().ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStreamRef.current.addTrack(track)
            })
        }
    }

    const onCallHandleCancel = (e) => {
        setCalling(false)
        const constraints = {
            'video': false,
            'audio': true
        }
        navigator.mediaDevices.getUserMedia(constraints).then(stream => {
            console.log('Stop MediaStream:', stream);
            // hangup(stream)
            audioRef.current.stop();
        })
    }
    return (
        <>
        <div className='chat__footer'>
            <div className='d-flex justify-content-center'>
                <form className='form' onSubmit={handleSendMessage}>
                <input 
                    type="text" 
                    placeholder='Write message' 
                    className='message' 
                    value={message} 
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={handleTyping}
                    onKeyUp={handleTypingStop}
                    />
                    <button className="sendBtn">SEND</button>
                    <button type='button' onClick={onHandleCall} className="btn btn-sm btn-primary">Call</button>
                </form>
            </div>
        </div>
        
        <Modal show={calling}>
            <Modal.Header>
            <Modal.Title>{selectedUser?._id === userD?._id?"Outgoing":"Incomming"} Call</Modal.Title>
            </Modal.Header>
            <Modal.Body>{} calling you.</Modal.Body>
            <Modal.Footer>
            <Button variant="danger" onClick={call}>
                Cancel
            </Button>
            <Button variant="warning">
                Answer
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}

export default ChatFooter