import type {Message} from './contracts';

export const API_URL = 'ws://127.0.0.1:8080/ws/tv';
export const RECONNECT_MS = 1000;

export function connect(
  url: string,
  onMessage: (m: Message) => void,
  makeSocket: (url: string) => WebSocket = u => new WebSocket(u),
): () => void {
  let socket: WebSocket;
  let stopped = false;

  const open = (): void => {
    if (stopped) {
      return;
    }
    socket = makeSocket(url);
    socket.onmessage = event => onMessage(JSON.parse(event.data) as Message);
    socket.onclose = () => setTimeout(open, RECONNECT_MS);
  };
  open();

  return () => {
    stopped = true;
    socket.close();
  };
}
