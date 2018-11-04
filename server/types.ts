import { IpcMessageEvent } from 'electron';

export type ExtendedGlobal = NodeJS.Global & { singletons?: Record<string, any> };

export interface MessageBase<T> {
  event: IpcMessageEvent;
  arg: T;
}

export interface ErrorObject {
  error: any;
}
