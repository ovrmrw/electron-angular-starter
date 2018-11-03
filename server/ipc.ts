import { ipcMain, IpcMessageEvent } from 'electron';

ipcMain.on('asynchronous-message', (event: IpcMessageEvent, arg) => {
  console.log(arg); // prints "ping"
  event.sender.send('asynchronous-reply', 'pong - async');
});

ipcMain.on('synchronous-message', (event: IpcMessageEvent, arg) => {
  console.log(arg); // prints "ping"
  event.returnValue = 'pong - sync';
});
