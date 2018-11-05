import { EventEmitter } from 'events';

export const mockIpcRenderer: EventEmitter & { send: Function } = new EventEmitter() as any;
mockIpcRenderer.send = () => {};
