import { RxMessenger, pong$ } from '../rx-messenger';
import { take } from 'rxjs/operators';
import { MESSENGER } from '../const';
import { getTestContainer } from './test-helpers';
import { EventEmitter } from 'events';

const mockIpcMain = new EventEmitter();
const mockEvent = {
  sender: {
    send: () => {}
  }
};

describe('RxMessenger', () => {
  let rxMessenger: RxMessenger;

  beforeEach(() => {
    const container = getTestContainer({ ipcMain: mockIpcMain });
    container.bind(RxMessenger).toSelf();
    rxMessenger = container.get(RxMessenger);
  });

  it('should be created.', () => {
    expect(rxMessenger).toBeTruthy();
  });

  describe('#setEventListeners', () => {
    it('can get mutated value after rx operators worked.', done => {
      const sourceValue = 'ping1';
      const spy = spyOn(mockEvent.sender, 'send').and.returnValue(void 0);
      rxMessenger.result$.pipe(take(1)).subscribe({
        next: v => {
          const expected = { value: sourceValue + 'pong', error: null };
          expect(v).toEqual(expected);
          expect(spy).toHaveBeenCalledWith(MESSENGER.REPLY, expected);
        },
        complete: done
      });
      mockIpcMain.emit(MESSENGER.SEND, [mockEvent, sourceValue]);
    });
  });
});

describe('pong$ function', () => {
  it('should get every emitted value as extended object through the stream.', async done => {
    const results: any[] = [];
    const sourceValue1 = 'ping1';
    const sourceValue2 = 'ping2';
    pong$(mockIpcMain as any, MESSENGER.SEND, { delayTime: 0 })
      .pipe(take(2))
      .subscribe({
        next: v => results.push(v),
        complete: () => {
          expect(results).toEqual([
            { event: mockEvent, arg: sourceValue1, value: sourceValue1 + 'pong', error: null },
            { event: mockEvent, arg: sourceValue2, value: sourceValue2 + 'pong', error: null }
          ]);
          done();
        }
      });
    mockIpcMain.emit(MESSENGER.SEND, [mockEvent, sourceValue1]);
    mockIpcMain.emit(MESSENGER.SEND, [mockEvent, sourceValue2]);
  });
});
