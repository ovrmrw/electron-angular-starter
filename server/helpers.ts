import { ExtendedGlobal } from './types';
declare var global: ExtendedGlobal;

export function singleton<T>(name: string, createInstance: () => T): T | undefined {
  if (typeof global === 'undefined') {
    return;
  }
  if (!global.singletons) {
    global.singletons = {};
  }
  if (!global.singletons[name]) {
    global.singletons[name] = createInstance();
    console.log(`created singleton instance [${name}]:`, global.singletons[name]);
  }
  return global.singletons[name];
}
