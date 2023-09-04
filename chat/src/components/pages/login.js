import axios from 'axios'
import React, {useState} from 'react'
import {useNavigate} from "react-router-dom"

const Login = ({socket}) => {
    const navigate = useNavigate()
    const [userName, setUserName] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()

        axios.post("http://localhost:4000/login", {user: userName})
        .then((d) => {
          localStorage.setItem("user", JSON.stringify(d.data))
        })
        .catch((e) => {
          console.log(e);
        })
        socket.auth = {user: userName}
        socket.emit("user login", {user: userName, socketID: socket.id})
        navigate("/")
    }
  return (
    <form className='home__container' onSubmit={handleSubmit}>
        <h2 className='home__header'>Sign in to Open Chat</h2>
        <label htmlFor="username">Username</label>
        <input type="text" 
        // minLength={6} 
          name="username" 
          id='username'
          className='username__input' 
          value={userName} 
          onChange={e => setUserName(e.target.value)}
        />
        <button className='home__cta'>SIGN IN</button>
    </form>
  )
}

export default Login