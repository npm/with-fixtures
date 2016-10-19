const P = require('bluebird');

module.exports = function withFixtures(fixtures, fn) {
  return P.all(fixtures).then(fixtures => {
    const subject = P.try(fn);
    const cleanups = subject.catch(() => null).then(() => P.all(fixtures.map(e => P.try(() => {
      e.done()
    }))));
    return P.join(subject, cleanups);
  });
};