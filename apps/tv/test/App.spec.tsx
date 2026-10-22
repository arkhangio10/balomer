/* global globalThis */
import 'react-native';
import {act, render} from '@testing-library/react-native';
import * as React from 'react';

import {App} from '../src/App';
import type {Session} from '../src/contracts';

class FakeSocket {
  static last: FakeSocket;
  onmessage: ((event: {data: string}) => void) | null = null;
  onclose: (() => void) | null = null;

  constructor() {
    FakeSocket.last = this;
  }

  close(): void {}
}

const session: Session = {
  type: 'session',
  match_id: 'sample',
  half: 1,
  pitch_length_m: 105,
  pitch_width_m: 68,
  credit: 'Synthetic test sample',
};

const realWebSocket = globalThis.WebSocket;

beforeEach(() => {
  globalThis.WebSocket = FakeSocket as unknown as typeof WebSocket;
});

afterEach(() => {
  globalThis.WebSocket = realWebSocket;
});

describe('App', () => {
  it('shows the session credit on the clock bar', () => {
    const screen = render(<App />);
    act(() => FakeSocket.last.onmessage?.({data: JSON.stringify(session)}));
    expect(screen.getByText(session.credit)).toBeTruthy();
  });
});
