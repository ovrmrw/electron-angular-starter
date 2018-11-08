import { TestBed } from '@angular/core/testing';
import { MessengerService, reply$ } from './messenger.service';
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
      electronService.ipcRenderer.emit(MESSENGER.REPLY, [null, sourceValue]);
    });
  });

  describe('#send', () => {
    it('ipcRenderer.send has also been called.', () => {
      const sourceValue = 'hoge';
      const spy = spyOn(electronService.ipcRenderer, 'send').and.returnValue(void 0);
      service.send(sourceValue);
      expect(spy).toHaveBeenCalledWith(MESSENGER.SEND, sourceValue);
    });
  });
});

describe('reply$ function', () => {
  it('should get every emitted value through the stream.', done => {
    const results: any[] = [];
    const sourceValue1 = { value: 'hoge1', error: null };
    const sourceValue2 = { value: 'hoge2', error: null };
    reply$(mockIpcRenderer as any, MESSENGER.REPLY)
      .pipe(take(2))
      .subscribe({
        next: v => results.push(v),
        complete: () => {
          expect(results).toEqual([sourceValue1, sourceValue2]);
          done();
        }
      });
    mockIpcRenderer.emit(MESSENGER.REPLY, [null, sourceValue1]);
    mockIpcRenderer.emit(MESSENGER.REPLY, [null, sourceValue2]);
  });
});
