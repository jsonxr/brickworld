import { assert } from 'chai';
import debug from '../../src/shared/debug';


describe('shared/debug', () => {
  describe('default(ns)', () => {
    it('should NOT log unless DEBUG is defined', () => {
      const log = debug('geometry-heap');
      log('This log line should NOT show up...');
    });
    it('should create logger if global.DEBUG contains ns', () => {
      // set global
      if (typeof(window) !== 'undefined') {                                  // Browser
        window.DEBUG = 'geometry-heap';
      } else {
        process.env.DEBUG = 'geometry-heap';
      }
      const log = debug('geometry-heap');
      log('This log line should show.');
      assert(true);
      // unset global
      if (typeof(window) !== 'undefined') {                                  // Browser
        delete window.DEBUG;
      } else {
        delete process.env.DEBUG;
      }
    });
  });
});
