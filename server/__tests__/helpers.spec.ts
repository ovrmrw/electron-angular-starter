import { singleton } from '../helpers';

class SomeClass {}

describe('helper functions', () => {
  describe('singleton', () => {
    it('not to be singleton when instances are created directly.', () => {
      const instance1 = new SomeClass();
      const instance2 = new SomeClass();
      expect(instance1).not.toBe(instance2);
    });

    it('to be singleton when an instance is created by singleton function.', () => {
      const instance1 = singleton('sameName', () => new SomeClass());
      const instance2 = singleton('sameName', () => new SomeClass());
      expect(instance1).toBe(instance2);
    });
  });
});
