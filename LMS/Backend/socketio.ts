import { Server } from "socket.io";
import { app } from "./app.js";
import http from "http";
import dotenv from "dotenv";
dotenv.config();

export const socketServer = http.createServer(app);

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  newNotification : ()=>void;
}

interface ClientToServerEvents {
  hello: () => void;
  notification: ()=>void
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

// let io;

// export const initSocketServer = (server: any) => {
//   io = new Server<
//     ClientToServerEvents,
//     ServerToClientEvents,
//     InterServerEvents,
//     SocketData
//   >(server, {
//     cors: {
//       credentials: true,
//       origin: process.env.FRONTEND_URL,
//     },
//   });
// };

export const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(socketServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

io.on('connection',(socket)=>{
  console.log('connection eastablished on server')
  socket.on('notification',()=>{
    io.emit('newNotification')
  })
  socket.on('disconnect',()=>{
    console.log('socket connection disconnected')
  })
})
