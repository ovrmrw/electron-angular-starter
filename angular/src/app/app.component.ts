import { Component } from '@angular/core';
import { ElectronService } from './electron.service';
import { IpcMessageEvent } from 'electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular';

  constructor(private electron: ElectronService) {}

  sendMessage(): void {
    console.log(
      this.electron.ipcRenderer.sendSync('synchronous-message', 'ping - sync')
    ); // prints "pong"

    this.electron.ipcRenderer.on(
      'asynchronous-reply',
      (event: IpcMessageEvent, arg) => {
        console.log(arg); // prints "pong"
      }
    );
    this.electron.ipcRenderer.send('asynchronous-message', 'ping - async');
  }
}
