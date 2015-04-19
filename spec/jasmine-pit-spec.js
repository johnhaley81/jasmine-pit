/* global pit */

var jasminePit = require('../index');
var Q = require('q');

jasminePit.install(global);

describe('JasminePit: ', function () {

  it('should have `pit`, `xpit` on globalObject', function () {
    expect(global.pit).toBeDefined();
    expect(global.xpit).toBeDefined();
  });

  var trueFn = function() { return true; }
  var promiseTrue = function() { return Q.fcall(trueFn); }

  pit('promised true is true', function() {

    return promiseTrue().then(function(result) {
      expect(result).toBe(true);
    });

  });

  xpit('xpit should be ignored', function() {

    // test will not show as 'pending' in Jasmine 1.x results
    return promiseTrue().then(function(result) {
      expect(result).toBe(false);
    });

  });

  var isLegacyJasmine = jasmine.version_ && jasmine.version_.major === 1;

  if (isLegacyJasmine) {

    describe('Jasmine 1.x specific', function () {

      it('should have pit.only defined', function() {
        expect(global.pit.only).toBeDefined();
      });

    });

  } else {

    describe('Jasmine 2.x specific', function () {

      it('should have `fpit` on globalObject', function () {
        expect(global.fpit).toBeDefined();
      });

    });

  }

});
