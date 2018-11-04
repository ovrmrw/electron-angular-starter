import { TestBed } from '@angular/core/testing';
import { MessengerService } from './messenger.service';
import { ElectronService } from './electron.service';
import { take } from 'rxjs/operators';
import { MESSENGER } from '../../../server/const';

const ipcRenderer = {
  on: () => {},
  send: () => {}
};

describe('MessengerService', () => {
  let service: MessengerService;
  let electronService: ElectronService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MessengerService,
        {
          provide: ElectronService,
          useValue: { ipcRenderer }
        }
      ]
    });
    service = TestBed.get(MessengerService);
    electronService = TestBed.get(ElectronService);
  });

  it('should be created.', () => {
    expect(service).toBeTruthy();
  });

  describe('#replyEventCallback', () => {
    it('result$ will get a value from eventCallback.', done => {
      const value = 'hoge';
      service.result$.pipe(take(1)).subscribe(v => {
        expect(v).toBe(value);
        done();
      });
      service.replyEventCallback(value);
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
