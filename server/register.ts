import { IpcExample } from './ipc';
import { RxMessenger } from './rx-messenger';
import { singleton } from './helpers';

singleton('ipcExample', () => new IpcExample());
singleton('rxMessenger', () => new RxMessenger());
