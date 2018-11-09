import { IpcMessageEvent } from 'electron';

export type MessageTupleBase<T> = [IpcMessageEvent, T];

export interface ReplyBase<T> {
  value: T | undefined;
  error: any;
}
