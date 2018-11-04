import { WebContents } from 'electron';
import { Subject } from 'rxjs';
import { map, delay, tap } from 'rxjs/operators';
import { MESSENGER } from './const';
import { MessageBase, ErrorObject } from './types';
import { electronModules } from './helpers';

export type MessengerSendProtocol = string;
export type MessengerReplyProtocol = string;

type Message = MessageBase<MessengerSendProtocol>;

export class RxMessenger {
  private subject$: Subject<Message> | null;
  private cachedSender: WebContents;
  successResult$: Subject<MessengerReplyProtocol> = new Subject();
  failureResult$: Subject<ErrorObject> = new Subject();

  constructor() {
    this.setEventListeners();
  }

  setEventListeners(): void {
    const ipcMain = electronModules().ipcMain;
    ipcMain.on(MESSENGER.SEND, (event, arg) => this.sendEventCallback({ event, arg }));
  }

  sendEventCallback(message: Message): void {
    if (!this.subject$) {
      this.subject$ = this.createSubject();
    }
    this.subject$.next(message);
  }

  createSubject(): Subject<Message> {
    const subject$ = new Subject<Message>();
    subject$
      .pipe(
        tap(({ event }) => (this.cachedSender = event.sender)),
        map(o => ({ ...o, value: o.arg + 'pong' })),
        delay(500)
      )
      .subscribe({
        next: ({ event, value }) => {
          event.sender.send(MESSENGER.REPLY, value);
          this.successResult$.next(value);
        },
        error: err => {
          console.error(err);
          const value = { error: err };
          if (this.cachedSender) {
            this.cachedSender.send(MESSENGER.REPLY, value);
          }
          this.failureResult$.next(value);
          this.subject$ = null;
        }
      });
    return subject$;
  }
}
