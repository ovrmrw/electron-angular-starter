import { IpcMessageEvent, IpcMain, App, Screen } from 'electron';

export interface ElectronModules {
  app: Readonly<App>;
  screen: Readonly<Screen>;
  ipcMain: Readonly<IpcMain>;
}

export type ExtendedGlobal = NodeJS.Global & { _singletons?: Record<string, any>; _electron?: ElectronModules };

export interface MessageBase<T> {
  event: IpcMessageEvent;
  arg: T;
}

export interface ErrorObject {
  error: any;
}
