import { TestBed } from '@angular/core/testing';
import { MessengerService } from './messenger.service';
import { ElectronService } from './electron.service';
import { take } from 'rxjs/operators';
import { MESSENGER } from '../../../server/const';
import { mockIpcRenderer } from './testing/test-helpers';

describe('MessengerService', () => {
  let service: MessengerService;
  let electronService: ElectronService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MessengerService,
        {
          provide: ElectronService,
          useValue: { ipcRenderer: mockIpcRenderer }
        }
      ]
    });
    service = TestBed.get(MessengerService);
    electronService = TestBed.get(ElectronService);
  });

  it('should be created.', () => {
    expect(service).toBeTruthy();
  });

  describe('#setEventListeners', () => {
    it('result$ will get a value from eventCallback.', done => {
      const sourceValue = { value: 'hoge', error: null };
      service.result$.pipe(take(1)).subscribe(v => {
        expect(v).toEqual(sourceValue);
        done();
      });
      electronService.ipcRenderer.emit(MESSENGER.REPLY, { event: {}, arg: sourceValue });
    });
  });

  describe('#send', () => {
    it('ipcRenderer.send has also been called.', () => {
      const value = 'hoge';
      const spy = spyOn(electronService.ipcRenderer, 'send').and.returnValue(void 0);
      service.send(value);
      expect(spy).toHaveBeenCalledWith(MESSENGER.SEND, value);
    });
  });
});
