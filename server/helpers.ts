import { ExtendedGlobal } from './types';
declare var global: ExtendedGlobal;

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function singleton<T>(name: string, createInstance: () => T): T {
  if (typeof global === 'undefined') {
    return void 0 as any;
  }
  if (!global._singletons) {
    global._singletons = {};
  }
  if (!global._singletons[name]) {
    global._singletons[name] = createInstance();
    if (isDevelopment()) {
      console.log(`created singleton instance [${name}]:`, global._singletons[name]);
    }
  }
  return global._singletons[name];
}
