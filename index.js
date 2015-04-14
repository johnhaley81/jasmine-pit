/* global define */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return (root.jasminePit = factory());
    });
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.jasminePit = factory();
  }
}(this, function () {
  function assert(desc, test) {
    if (!test) {
      throw new Error(desc);
    }
  }

  function assertPromise(promise) {
    assert('pit() tests should return a promise',
      promise && typeof promise.then === 'function');
  }

  function wrapPromiseLegacyJasmine(promiseFn) {
    return function () {
      var error = null;
      var isFinished = false;

      runs(function () {
        try {
          var promise = promiseFn();

          assertPromise(promise);

          promise.then(function () {
            isFinished = true;
          })['catch'](function (err) {
            error = err;
            isFinished = true;
          });
        } catch (e) {
          error = e;
          isFinished = true;
        }
      });

      waitsFor(function () {
        return isFinished;
      });

      runs(function () {
        if (error) throw error;
      });
    };
  }

  function wrapPromiseJasmine(promiseFn) {
    return function (done) {
      var promise = promiseFn();

      try {
        assertPromise(promise);
      } catch (e) {
        done.fail(e);
      }

      promise.then(function (res) {
        done(res);
      })['catch'](function (err) {
        done.fail(err);
      });
    };
  }

  function install(globalObject) {
    var jasmine = globalObject.jasmine;

    assert(
      'It looks like you\'re trying to install jasmine-pit before installing ' +
      'jasmine! Make sure there is a `jasmine` property on the global object ' +
      '(window/global/etc) before calling install().', jasmine);

    var env = jasmine.getEnv();
    var isLegacyJasmine = jasmine.version_ && jasmine.version_.major === 1;
    var wrapFn = isLegacyJasmine ? wrapPromiseLegacyJasmine : wrapPromiseJasmine;

    globalObject.pit = function pit(specName, promiseFn) {
      return env.it(specName, wrapFn(promiseFn));
    };

    globalObject.xpit = function xpit(specName, promiseFn) {
      return env.xit(specName, wrapFn(promiseFn));
    };

    if (isLegacyJasmine) {
      globalObject.pit.only = function pitOnly(specName, promiseFn) { // TODO: add note for jasmine-only
        return env.it.only(specName, wrapFn(promiseFn));
      };
    } else {
      globalObject.fpit = function fpit(desc, promiseFn) {
        return env.fit(desc, wrapFn(promiseFn));
      };
    }
  }

  return {
    install: install
  };
}));
