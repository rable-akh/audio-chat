import React, {useEffect} from 'react'

const ChatBar = ({socket, selectedUser, users, setUsers, newmsgfrom}) => {
    // const [users, setUsers] = useState([])

    // const getUser = async () => {
    //     axios.get('http://localhost:4000/users')
    //     .then((res) => {
    //         if(res.status===200){
    //         setUsers(res.data)
    //         }
    //     })
    //     .catch((e) => {
    
    //     })
    // }

    useEffect(()=> {
        // getUser()
        socket.on("activeUserResponse", data => setUsers(data))

        socket.on("userLeave", (data) => {
            // console.log(data);
        })
        // console.log(users);
    }, [users, socket])

  return (
    <div className='chat__sidebar'>
        <h2>Open Chat</h2>
        <div>
            <h4  className='chat__header'>ACTIVE USERS</h4>
            <div className='chat__users text-start'>
                {
                    users.map(user => 
                        <p key={user._id} className={user.connected?"text-success fw-bold position-relative":"position-relative"} onClick={(e)=> selectedUser(user)}>
                            {user.user}{newmsgfrom?.from===user._id&&<span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle"/>}
                        </p>
                    )
                }
            </div>
        </div>
  </div>
  )
}

export default ChatBar