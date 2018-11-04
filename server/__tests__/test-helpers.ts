import { ExtendedGlobal } from '../types';
declare var global: ExtendedGlobal;

export function mockElectronModules() {
  global._electron = {
    ipcMain: {
      on: () => {}
    }
  } as any;
}

export function removeElectronModules() {
  delete global._electron;
}
