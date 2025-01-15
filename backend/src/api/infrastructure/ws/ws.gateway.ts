import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { WebSocket } from 'ws';

@WebSocketGateway()
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: WebSocket.Server;

  private clients = new Map<string, WebSocket>();

  handleConnection(client: WebSocket, req: any) {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const userId = urlParams.get('id');

    console.log('Client connected ', userId);

    this.clients.set(userId, client);

    // 监听客户端关闭事件
    client.on('close', () => {
      this.clients.delete(userId);
      console.log(`Client disconnected with ID: ${userId}`);
    });

    // 监听每个客户端的消息
    client.on('message', (data) => {
      console.log('Received message from client:', data);
      client.send(`Server received: ${data}`); // 发送回客户端确认
    });
  }

  handleDisconnect(client: WebSocket) {
    console.log('Client disconnected', client);
  }
}
