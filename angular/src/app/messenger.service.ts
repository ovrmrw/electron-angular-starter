import { Injectable, NgZone } from '@angular/core';
import { ElectronService } from './electron.service';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { MessengerSendProtocol, MessengerReplyProtocol } from '../../../server/rx-messenger';
import { MESSENGER } from '../../../server/const';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {
  private reciever$ = new Subject<MessengerReplyProtocol>();

  constructor(private electron: ElectronService, private ngZone: NgZone) {
    this.setEventListeners();
  }

  setEventListeners(): void {
    this.electron.ipcRenderer.on(MESSENGER.REPLY, (_, arg) => this.replyEventCallback(arg));
  }

  replyEventCallback(arg: MessengerReplyProtocol): void {
    this.ngZone.run(() => this.reciever$.next(arg));
  }

  send(message: MessengerSendProtocol): void {
    this.electron.ipcRenderer.send(MESSENGER.SEND, message);
  }

  get result$(): Observable<MessengerReplyProtocol> {
    return this.reciever$.pipe(tap(console.log));
  }
}
