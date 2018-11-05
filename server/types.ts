import { IpcMessageEvent, IpcMain, App, Screen } from 'electron';

export interface ElectronModules {
  app: App;
  screen: Screen;
  ipcMain: IpcMain;
}

export type ExtendedGlobal = NodeJS.Global & { _singletons: Record<string, any>; _electron: ElectronModules };

export type MessageTupleBase<T> = [IpcMessageEvent, T];

export interface ReplyBase<T> {
  value: T | undefined;
  error: any;
}
