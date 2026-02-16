import { io, Socket } from "socket.io-client";
interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  newNotification: ()=>void;
}

interface ClientToServerEvents {
  hello: () => void;
  notification: ()=>void;
}

// please note that the types are reversed
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env.NEXT_PUBLIC_API_URL,
  {
    transports: ["websocket"],
    withCredentials:true,
    autoConnect:true
  },
);
