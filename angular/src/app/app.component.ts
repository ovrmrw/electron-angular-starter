import { Component, OnInit } from '@angular/core';
import { ElectronService } from './electron.service';
import { MessengerService } from './messenger.service';
import { Observable } from 'rxjs';

import { MessengerRecieveProtocol } from '../../../server/rx-messenger';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular';
  result$: Observable<MessengerRecieveProtocol>;
  count = 0;

  constructor(private electron: ElectronService, private messenger: MessengerService) {}

  ngOnInit() {
    this.connectObservables();
  }

  connectObservables(): void {
    this.result$ = this.messenger.result$;
  }

  sendMessage(): void {
    console.log(this.electron.ipcRenderer.sendSync('synchronous-message', 'ping - sync')); // prints "pong"

    this.electron.ipcRenderer.on('asynchronous-reply', (event, arg) => {
      console.log(arg); // prints "pong"
    });
    this.electron.ipcRenderer.send('asynchronous-message', 'ping - async');
  }

  sendMessageRx(): void {
    this.messenger.send(`ping${this.count}`);
    this.count++;
  }
}
