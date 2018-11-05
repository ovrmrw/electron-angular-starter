import { EventEmitter } from 'events';
import { ExtendedGlobal } from '../types';
declare var global: ExtendedGlobal;

export function setMockElectronModules(options: { ipcMain?: EventEmitter } = {}) {
  global._electron = {
    ipcMain: options.ipcMain
      ? options.ipcMain
      : {
          on: () => {}
        }
  } as any;
}

export function removeMockElectronModules() {
  delete global._electron;
}
