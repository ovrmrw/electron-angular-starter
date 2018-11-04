import { IpcMessageEvent } from 'electron';

export interface MessageBase<T> {
  event: IpcMessageEvent;
  arg: T;
}

export interface ErrorObject {
  error: any;
}
