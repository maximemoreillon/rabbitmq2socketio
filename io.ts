import { Server } from 'socket.io'
import http from 'http'

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
    hello: () => void;
}

interface InterServerEvents {
    ping: () => void;
}

interface SocketData {
    name: string;
    age: number;
}


// Not elegant, could benefit from using a class
let io: any


const ioInit = (server: http.Server) => {
    const socketio_options = { cors: { origin: '*' } }
    const io = new Server<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        SocketData
    >(server, socketio_options)
    console.log('[Socket.io] Initialized')

    io.on('connection', (socket) => {
        console.log(`[Socket.io] socket ${socket.id} connected`);
    })

}

const getIo = () => io

export {
    ioInit,
    getIo
}
