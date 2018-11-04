import { IpcMessageEvent } from 'electron';
import { electronModules } from './helpers';

export class IpcExample {
  constructor() {
    this.setEventListeners();
  }

  setEventListeners(): void {
    const ipcMain = electronModules().ipcMain;

    ipcMain.on('asynchronous-message', (event: IpcMessageEvent, arg) => {
      console.log(arg); // prints "ping"
      event.sender.send('asynchronous-reply', 'pong - async');
    });

    ipcMain.on('synchronous-message', (event: IpcMessageEvent, arg) => {
      console.log(arg); // prints "ping"
      event.returnValue = 'pong - sync';
    });
  }
}
