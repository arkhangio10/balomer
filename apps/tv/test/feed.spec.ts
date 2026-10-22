import type {Message} from '../src/contracts';
import {connect, RECONNECT_MS} from '../src/feed';

class FakeSocket {
  onmessage: ((event: {data: string}) => void) | null = null;
  onclose: (() => void) | null = null;
  closed = false;

  constructor(readonly url: string) {}

  close(): void {
    this.closed = true;
    this.onclose?.();
  }
}

const TV_URL = 'ws://test/ws/tv';
let sockets: FakeSocket[];

const makeSocket = (url: string): WebSocket => {
  const socket = new FakeSocket(url);
  sockets.push(socket);
  return socket as unknown as WebSocket;
};

beforeEach(() => {
  sockets = [];
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('connect', () => {
  it('parses each message', () => {
    const onMessage = jest.fn();
    const message: Message = {type: 'phase', phase: 'kickoff', half: 1};
    connect(TV_URL, onMessage, makeSocket);
    sockets[0].onmessage?.({data: JSON.stringify(message)});
    expect(sockets[0].url).toBe(TV_URL);
    expect(onMessage).toHaveBeenCalledWith(message);
  });

  it('reconnects one second after a close', () => {
    connect(TV_URL, jest.fn(), makeSocket);
    sockets[0].onclose?.();
    jest.advanceTimersByTime(RECONNECT_MS - 1);
    expect(sockets).toHaveLength(1);
    jest.advanceTimersByTime(1);
    expect(sockets).toHaveLength(2);
  });

  it('closes the socket and makes no new one once stopped', () => {
    const stop = connect(TV_URL, jest.fn(), makeSocket);
    stop();
    jest.advanceTimersByTime(RECONNECT_MS * 5);
    expect(sockets[0].closed).toBe(true);
    expect(sockets).toHaveLength(1);
  });

  it('makes no new socket when stopped while waiting to reconnect', () => {
    const stop = connect(TV_URL, jest.fn(), makeSocket);
    sockets[0].onclose?.();
    stop();
    jest.advanceTimersByTime(RECONNECT_MS * 5);
    expect(sockets).toHaveLength(1);
  });
});
