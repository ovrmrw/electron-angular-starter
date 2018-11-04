import { RxMessenger } from '../rx-messenger';
import { take } from 'rxjs/operators';
import { MESSENGER } from '../const';
import { mockElectronModules, removeElectronModules } from './test-helpers';

const mockEvent = {
  sender: {
    send: () => {}
  }
};

describe('RxMessenger', () => {
  let rxMessenger: RxMessenger;

  beforeEach(() => {
    mockElectronModules();
    rxMessenger = new RxMessenger();
  });

  afterEach(() => {
    removeElectronModules();
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
