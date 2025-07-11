import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SocketContextData } from './types';
import { socket } from '@/service/socket';

export const SocketContext = createContext({} as SocketContextData);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  useEffect(() => {
    socket.on('invalidate', function () {
      queryClient.invalidateQueries({
        queryKey: ['proposals'],
        refetchType: 'all',
      });
    });
    return () => {
      console.log('chegou aqui')
      socket.off('invalidate');
      
    };
  }, [socket]);
  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocketContext = () => {
  return useContext(SocketContext);
};
