import io from 'socket.io-client'
import {serverConfig} from './config'

export function socketServer() {
    const socket = io(serverConfig.socketIP,{
        withCredentials: false,
    });
    return socket;
}