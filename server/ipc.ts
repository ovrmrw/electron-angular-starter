import { injectable, inject } from 'inversify';
import { IpcMessageEvent, IpcMain } from 'electron';
import { ELECTRON } from './const';

@injectable()
export class IpcExample {
  constructor(@inject(ELECTRON.IPC_MAIN) private ipcMain: IpcMain) {
    this.setEventListeners();
  }

  setEventListeners(): void {
    this.ipcMain.on('asynchronous-message', (event: IpcMessageEvent, arg) => {
      console.log(arg); // prints "ping"
      event.sender.send('asynchronous-reply', 'pong - async');
    });

    this.ipcMain.on('synchronous-message', (event: IpcMessageEvent, arg) => {
      console.log(arg); // prints "ping"
      event.returnValue = 'pong - sync';
    });
  }
}
