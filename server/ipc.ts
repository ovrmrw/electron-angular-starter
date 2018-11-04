import { IpcMessageEvent } from 'electron';
import { electronAsync } from './helpers';

electronAsync().then(electron => {
  const ipcMain = electron.ipcMain;

  ipcMain.on('asynchronous-message', (event: IpcMessageEvent, arg) => {
    console.log(arg); // prints "ping"
    event.sender.send('asynchronous-reply', 'pong - async');
  });

  ipcMain.on('synchronous-message', (event: IpcMessageEvent, arg) => {
    console.log(arg); // prints "ping"
    event.returnValue = 'pong - sync';
  });
});
