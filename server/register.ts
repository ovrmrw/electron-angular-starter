import './ipc';
import { RxMessenger } from './rx-messenger';
import { singleton } from './helpers';

singleton('rxMessenger', () => new RxMessenger());
