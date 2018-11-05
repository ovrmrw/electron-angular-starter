import { RxMessenger } from '../rx-messenger';
import { take } from 'rxjs/operators';
import { MESSENGER } from '../const';
import { setMockElectronModules, removeMockElectronModules } from './test-helpers';
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
    setMockElectronModules({ ipcMain: mockIpcMain });
    rxMessenger = new RxMessenger();
  });

  afterEach(() => {
    removeMockElectronModules();
  });

  it('should be created.', () => {
    expect(rxMessenger).toBeTruthy();
  });

  describe('#setEventListeners', () => {
    it('can get mutated value after rx operators worked.', done => {
      const sourceValue = 'ping';
      const spy = spyOn(mockEvent.sender, 'send').and.returnValue(void 0);
      rxMessenger.result$.pipe(take(1)).subscribe(v => {
        const expected = { value: sourceValue + 'pong', error: null };
        expect(v).toEqual(expected);
        expect(spy).toHaveBeenCalledWith(MESSENGER.REPLY, expected);
        done();
      });
      mockIpcMain.emit(MESSENGER.SEND, { event: mockEvent, arg: sourceValue });
    });
  });
});
