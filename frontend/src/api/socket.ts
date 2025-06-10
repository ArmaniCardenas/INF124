import { io } from 'socket.io-client';
export const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000', {
  withCredentials: true,
  // autoConnect: false,
});