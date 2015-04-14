/* global pit */

var jasminePit = require('../index');

jasminePit.install(global);

describe('JasminePit: ', function () {
  it('should have `pit`, `xpit` on globalObject', function () {
    expect(global.pit).toBeDefined();
    expect(global.xpit).toBeDefined();
  });

  describe('Jasmine 1.x specific', function () {});

  describe('Jasmine 2.x specific', function () {
    it('should have `fpit` on globalObject', function () {
      expect(global.fpit).toBeDefined();
    });
  });
});
