export const MESSENGER = Object.freeze({
  SEND: 'messenger-send',
  REPLY: 'messenger-reply'
});

export const ELECTRON = Object.freeze({
  APP: Symbol.for('app'),
  SCREEN: Symbol.for('screen'),
  IPC_MAIN: Symbol.for('ipcMain')
});
