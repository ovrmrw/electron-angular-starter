// Types
import { MessengerSendProtocol, MessengerReplyProtocol } from '../../../server/rx-messenger';
import { MessageTupleBase } from '../../../server/types';
// Modules
import { Injectable, NgZone } from '@angular/core';
import { ElectronService } from './electron.service';
import { Observable, Subject, fromEvent } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { MESSENGER } from '../../../server/const';
import { IpcRenderer, IpcMessageEvent } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {
  private reciever$ = new Subject<MessengerReplyProtocol>();

  constructor(private electron: ElectronService, private ngZone: NgZone) {
    this.setEventListeners();
  }

  setEventListeners(): void {
    const { ipcRenderer } = this.electron;
    reply$<MessengerReplyProtocol>(ipcRenderer, MESSENGER.REPLY).subscribe({
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

export function reply$<T>(target: IpcRenderer, eventName: string): Observable<T> {
  return fromEvent<[IpcMessageEvent, T]>(target, eventName).pipe(
    map(([event, arg]) => arg),
    tap(arg => console.log(arg))
  );
}
