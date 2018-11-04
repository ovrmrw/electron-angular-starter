import { TestBed } from '@angular/core/testing';
import { ElectronService } from './electron.service';
declare var window: any;

class MockIpcRenderer {}
class MockFS {}

describe('ElectronService', () => {
  let service: ElectronService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ElectronService]
    });
    service = TestBed.get(ElectronService);
    window.require = function() {};
  });

  afterEach(() => {
    delete window.require;
    delete window.process;
  });

  it('should be created.', () => {
    expect(service).toBeTruthy();
  });

  describe('#isElectron', () => {
    it('return true when window has process.type', () => {
      window.process = {
        type: {}
      };
      expect(service.isElectron()).toBeTruthy();
    });

    it('return false when window does not have process.type', () => {
      expect(service.isElectron()).toBeFalsy();
    });
  });

  describe('#register', () => {
    const electron: any = {
      ipcRenderer: new MockIpcRenderer()
    };
    const fs: any = new MockFS();

    beforeEach(() => {
      spyOn(window, 'require').and.callFake(arg => {
        return arg === 'electron' ? electron : arg === 'fs' ? fs : null;
      });
    });

    it('set ipcRenderer', () => {
      service.register();
      expect(service.ipcRenderer).toBe(electron.ipcRenderer);
    });

    it('set fs', () => {
      service.register();
      expect(service.fs).toBe(fs);
    });
  });
});
