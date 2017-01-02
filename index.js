"use strict";

const P = require('bluebird');

module.exports = function withFixtures(fixtures, fn) {
  return P.all(fixtures).then(fixtures => {
    const subject = P.try(fn);
    const cleanups = subject.catch(() => null).then(() => P.all(fixtures.map(e => P.try(() => {
      if (typeof e.done == 'function') {
        return e.done()
      } else if (typeof e.restore == 'function') {
        return e.restore();
      } else {
        throw new Error(`${e} has no done nor restore method. Is it a fixture?`);
      }
    }))));
    return P.join(subject, cleanups);
  });
};
