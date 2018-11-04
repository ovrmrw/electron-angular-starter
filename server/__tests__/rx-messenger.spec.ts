import { RxMessenger } from '../rx-messenger';
import { ExtendedGlobal } from '../types';
import { take } from 'rxjs/operators';
import { MESSENGER } from '../const';
declare var global: ExtendedGlobal;

const mockEvent = {
  sender: {
    send: () => {}
  }
};

describe('RxMessenger', () => {
  let rxMessenger: RxMessenger;

  beforeEach(() => {
    global._electron = {
      ipcMain: {
        on: () => {}
      }
    } as any;
    rxMessenger = new RxMessenger();
  });

  it('should be created.', () => {
    expect(rxMessenger).toBeTruthy();
  });

  describe('#sendEventCallback', () => {
    it('can get mutated value after rx operators worked.', done => {
      const value = 'ping';
      const spy = spyOn(mockEvent.sender, 'send').and.returnValue(void 0);
      rxMessenger.successResult$.pipe(take(1)).subscribe(v => {
        const expectedValue = value + 'pong';
        expect(v).toBe(expectedValue);
        expect(spy).toHaveBeenCalledWith(MESSENGER.REPLY, expectedValue);
        done();
      });
      rxMessenger.sendEventCallback({ event: mockEvent as any, arg: value });
    });
  });
});
