// Types
import { IpcMessageEvent, IpcMain } from 'electron';
import { MessageTupleBase, ReplyBase } from './types';
// Modules
import { Subject, fromEvent, of, Observable } from 'rxjs';
import { map, delay, tap, catchError } from 'rxjs/operators';
import { MESSENGER } from './const';
import { electronModules } from './helpers';

export type MessengerSendProtocol = string;
export type MessengerReplyProtocol = ReplyBase<string>;

export class RxMessenger {
  result$: Subject<MessengerReplyProtocol> = new Subject();

  constructor() {
    this.setEventListeners();
  }

  setEventListeners(): void {
    const { ipcMain } = electronModules();
    pong$(ipcMain, MESSENGER.SEND, { delayTime: 500 }).subscribe({
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

export function pong$(
  target: IpcMain,
  eventName: string,
  options: { delayTime: number }
): Observable<SuccessPongResult | FailedPongResult> {
  let cached: { event: IpcMessageEvent; arg: string };
  return fromEvent<[IpcMessageEvent, string]>(target, eventName).pipe(
    map(([event, arg]) => ({ event, arg })),
    tap(o => (cached = o)),
    map(o => ({ ...o, value: o.arg + 'pong', error: null })),
    delay(options.delayTime),
    catchError(err => {
      return of({ ...cached, value: undefined, error: err.message || err });
    })
  );
}

interface SuccessPongResult {
  event: IpcMessageEvent;
  arg: string;
  value: string;
  error: null;
}

interface FailedPongResult {
  event: IpcMessageEvent;
  arg: string;
  value: undefined;
  error: string;
}
