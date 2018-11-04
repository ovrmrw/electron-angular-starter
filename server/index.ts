import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import { ExtendedGlobal } from './types';
declare var global: ExtendedGlobal;

global.singletons = {};

const prodBrowserWindowConfig = { width: 800, height: 600 };

const isDevelopment = process.env.NODE_ENV === 'development';
if (isDevelopment) {
  require('electron-reload')(__dirname, {
    electron: path.join(process.cwd(), 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
  });
}

console.log({ isDevelopment, __dirname });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const browserWindowConfig = isDevelopment
    ? {
        x: 0,
        y: 0,
        width,
        height
      }
    : prodBrowserWindowConfig;
  // Create the browser window.
  win = new BrowserWindow(browserWindowConfig);

  if (isDevelopment) {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  // and load the index.html of the app.
  if (isDevelopment) {
    win.loadURL('http://localhost:4200/');
  } else {
    win.loadFile(path.join(__dirname, '../front', 'index.html'));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

import './ipc';
import './rx-messenger';
