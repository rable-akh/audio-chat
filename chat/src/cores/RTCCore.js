const servers = {
    iceServers:[
        {
            urls:['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
        }
    ]
}


const { RTCPeerConnection, RTCSessionDescription } = window
const peerConnection = new RTCPeerConnection(servers);

// const singaling = new BroadcastChannel('webrtc');

export function peerConnect() {
    return peerConnection;
}

// export function onIceCandidate() {
//     peerConnection.onicecandidate = e => {
//         const message = {
//             type: 'candidate',
//             candidate: null,
//         }
//         if(e.candidate){
//             message.candidate = e.candidate.candidate;
//             message.sdpMid = e.candidate.sdpMid;
//             message.sdpMLineIndex = e.candidate.sdpMLineIndex;
//         }

//         // send message with broadcast
//         // peerConnection.addIceCandidate(e.candidate).then((d) => {
//         //     console.log("Candidate Success : ", d);
//         // }).catch((e) => {
//         //     console.log("Candidate Error : ", e);
//         // })
//     }

//     // peerConnection.ontrack = e => remoteStream.srcObject = e.streams[0];
// }

export async function callUser(socket, to, toUsr, from, fromUsr) {
    
    peerConnection.onicecandidate = async (event) => {
        if(event.candidate){
            socket.emit("candidate", {
                candidate: {'type':'candidate', 'candidate':event.candidate}, 
                to: to,
                toUsr: toUsr, 
                from: from,
                fromUsr: fromUsr
            })
        }
    }

    const offer = await peerConnection.createOffer();
    // console.log(offer);
    await peerConnection.setLocalDescription(offer);

    const state = peerConnection.signalingState;
    const iceConnectionState = peerConnection.iceConnectionState;

    console.log('callUser',state);
    console.log('callUser',iceConnectionState);
    
    socket.emit("call-user", {
        offer, 
        to: to,
        toUsr: toUsr, 
        from: from,
        fromUsr: fromUsr
    })
}

export async function madeAnswer(socket, data) {
    peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
    ).then(async (d) => {
        // console.log(d);
        const state = peerConnection.signalingState;
        const iceConnectionState = peerConnection.iceConnectionState;

        console.log(state);
        console.log(iceConnectionState);

        peerConnection.createAnswer().then( async (answer) => {
            await peerConnection.setLocalDescription(answer);
            socket.emit("make-answer", {
                answer, 
                to: data.from,
                toUsr: data.fromUsr, 
                from: data.to,
                fromUsr: data.toUsr
            })
        }).catch((ee) => {
            console.error('Send answer failed: ', ee);
        })
        
    }).catch((e) => {
        console.log("set remote error", e);
    })

    
}

export async function addAnswer(socket, data, isAlreadyCalling, setIsAlreadyCalling) {
    // console.log('callAnswer', data);

    // await peerConnection.setRemoteDescription(
    //     new RTCSessionDescription(data.answer)
    // );
    if(!peerConnection.currentRemoteDescription) {
        peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer)).then((d) => {
            socket.emit("answersuccess", "fdsafs")
        }).catch((e) => {
            console.log("setRemoteDescription ANS", e);
        })
    }
    // const state = peerConnection.signalingState;
    // const iceConnectionState = peerConnection.iceConnectionState;

    // console.log('callAnswer',state);
    // console.log('callAnswer',iceConnectionState);
      
    // if (!isAlreadyCalling) {
    //     callUser(data.socket);
    //     setIsAlreadyCalling(true);
    // }
}

export async function hangup(localStream){
    localStream.getTracks().forEach(track => track.stop());
    peerConnection.close();
}