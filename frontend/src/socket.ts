import { io } from "socket.io-client";
const url = process.env.REACT_APP_BASE_URL;

export const socket = io(`${url}`, { transports: ["websocket"] });
