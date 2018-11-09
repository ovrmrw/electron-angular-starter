import { Container } from 'inversify';
import { EventEmitter } from 'events';
import { ELECTRON } from '../const';

export function getTestContainer(options: { ipcMain?: EventEmitter } = {}) {
  const ipcMain = options.ipcMain
    ? options.ipcMain
    : {
        on: () => {}
      };
  const testContainer = new Container({ defaultScope: 'Singleton' });
  testContainer.bind(ELECTRON.IPC_MAIN).toConstantValue(ipcMain);
  return testContainer;
}
