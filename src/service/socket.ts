'use client';
import config from '@/config';
import { io } from 'socket.io-client';

const { baseUrlApi } = config.envs;
export const socket = io(baseUrlApi);

// socket.on('connect', () => {
//   socket.emit('join', 'proposals');
// });
