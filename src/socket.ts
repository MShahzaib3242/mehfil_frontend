import { io } from "socket.io-client";
import { socketUrl } from "./utils/constants";

export const socket = io(socketUrl);
