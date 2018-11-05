// Types
import { MessengerSendProtocol, MessengerReplyProtocol } from '../../../server/rx-messenger';
import { MessageTupleBase } from '../../../server/types';
// Modules
import { Injectable, NgZone } from '@angular/core';
import { ElectronService } from './electron.service';
import { Observable, Subject, fromEvent } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { MESSENGER } from '../../../server/const';

type MessageTuple = MessageTupleBase<MessengerReplyProtocol>;

@Injectable({
  providedIn: 'root'
})
export class MessengerService {
  private reciever$ = new Subject<MessengerReplyProtocol>();

  constructor(private electron: ElectronService, private ngZone: NgZone) {
    this.setEventListeners();
  }

  setEventListeners(): void {
    fromEvent<MessageTuple>(this.electron.ipcRenderer, MESSENGER.REPLY)
      .pipe(
        map(([event, arg]) => arg),
        tap(arg => console.log(arg))
      )
      .subscribe({
        next: arg => {
          this.ngZone.run(() => this.reciever$.next(arg));
        },
        error: err => {
          throw err;
        }
      });
  }

  send(message: MessengerSendProtocol): void {
    this.electron.ipcRenderer.send(MESSENGER.SEND, message);
  }

  get result$(): Observable<MessengerReplyProtocol> {
    return this.reciever$;
  }
}
