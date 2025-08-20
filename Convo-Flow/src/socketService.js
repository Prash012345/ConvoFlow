// src/socketService.js
import { io } from "socket.io-client";

// Initialize the Socket.io client
const socket = io("http://localhost:8000"); // Make sure this matches your backend URL

export default socket;
