import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';
import { useAuthStore } from './authStore'; // Import your auth store
import { useEffect } from 'react';

interface SocketState {
  socket: Socket | null;
  onlineUsers: string[];
  isConnected: boolean;
  setSocket: (socket: Socket | null) => void;
  setOnlineUsers: (users: string[]) => void;
  setIsConnected: (isConnected: boolean) => void;
  initializeSocket: (token: string) => void; // Modified to accept only token
}

export const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  onlineUsers: [],
  isConnected: false,
  setSocket: (socket) => set({ socket }),
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  setIsConnected: (isConnected) => set({ isConnected }),
  initializeSocket: (token) => {
    if (!token) return;

    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3002';

    const newSocket = io(SOCKET_URL, {
      auth: { token },
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      set({ isConnected: true });
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      set({ isConnected: false });
    });

    newSocket.on('active_users', (users: string[]) => {
      set({ onlineUsers: users });
    });

    newSocket.on('user_status', ({ userId, status }) => {
      set((state) => {
        if (status === 'online' && !state.onlineUsers.includes(userId)) {
          return { onlineUsers: [...state.onlineUsers, userId] };
        } else if (status === 'offline') {
          return { onlineUsers: state.onlineUsers.filter((id) => id !== userId) };
        }
        return {};
      });
    });

    set({ socket: newSocket });

    return () => {
      newSocket.disconnect();
    };
  },
}));

export const useSocket = () => {
  const token = useAuthStore((state) => state.checkAuth()); // Get the token
  const {
    socket,
    onlineUsers,
    isConnected,
    initializeSocket,
  } = useSocketStore();

  useEffect(() => {
    if (token) {
      const cleanup = initializeSocket(token);
      return cleanup;
    }
    return undefined;
  }, [token, initializeSocket]);

  return { socket, onlineUsers, isConnected };
};