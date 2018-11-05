import { Subject, fromEvent, of } from 'rxjs';
import { map, delay, tap, catchError } from 'rxjs/operators';
import { MESSENGER } from './const';
import { MessageBase, ReplyBase } from './types';
import { electronModules } from './helpers';
import { IpcMessageEvent } from 'electron';

export type MessengerSendProtocol = string;
export type MessengerReplyProtocol = ReplyBase<string>;

type Message = MessageBase<MessengerSendProtocol>;

export class RxMessenger {
  result$: Subject<MessengerReplyProtocol> = new Subject();

  constructor() {
    this.setEventListeners();
  }

  setEventListeners(): void {
    let cachedEvent: IpcMessageEvent;
    fromEvent<Message>(electronModules().ipcMain, MESSENGER.SEND)
      .pipe(
        tap(({ event }) => (cachedEvent = event)),
        map(o => ({ ...o, value: o.arg + 'pong', error: null })),
        delay(500),
        catchError(err => {
          return of({ event: cachedEvent, value: undefined, error: err.message || err });
        })
      )
      .subscribe({
        next: ({ event, value, error }) => {
          const reply = { value, error };
          event.sender.send(MESSENGER.REPLY, reply);
          this.result$.next(reply);
        },
        error: err => {
          throw err;
        }
      });
  }
}
