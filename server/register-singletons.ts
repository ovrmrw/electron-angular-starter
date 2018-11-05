import { IpcExample } from './ipc';
import { RxMessenger } from './rx-messenger';
import { singleton } from './helpers';

singleton(IpcExample.name, () => new IpcExample());
singleton(RxMessenger.name, () => new RxMessenger());
