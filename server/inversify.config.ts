import 'reflect-metadata';
import { Container } from 'inversify';
import { app, screen, ipcMain } from 'electron';
import { IpcExample } from './ipc';
import { RxMessenger } from './rx-messenger';
import { ELECTRON } from './const';

if (!app.isReady()) {
  throw new Error('"app" module is not ready!');
}

const myContainer = new Container({ defaultScope: 'Singleton' });
myContainer.bind(ELECTRON.APP).toConstantValue(app);
myContainer.bind(ELECTRON.SCREEN).toConstantValue(screen);
myContainer.bind(ELECTRON.IPC_MAIN).toConstantValue(ipcMain);
myContainer.bind(IpcExample).toSelf();
myContainer.bind(RxMessenger).toSelf();

myContainer.get(IpcExample);
myContainer.get(RxMessenger);
