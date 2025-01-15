import { io } from 'weapp.socket.io';
import { apiDomain } from '@/utils/request';

const baseUrl = `${apiDomain}/pos`;

const socket = io(baseUrl);

socket.on('connect', () => {
  console.log('连接成功');
});

socket.on('disconnect', () => {
  console.log('断开连接');
});

export default socket;
