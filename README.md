# withFixtures

A test helper to make sure fixtures are torn down and error messages are retained

## Summary

```
function withFixtures([Fixture, Fixture, ...], Fn -> Promise<Any>) -> Promise<Any>
```

## Example

```
const withFixtures = require('with-fixtures');

withFixtures([
  fixture1,
  fixture2
], () => {
  // Do test here and return a promise
}).then(() => console.log("Test passed"), err => cosole.warn("test failed"));

```

## Notes

A Fixture is an object with a `done()` method. Any errors thrown while tearing
down the fixture in the done method will be captured, and the first will be
reported as a rejection of the promise chain, if the test itself did not
reject.

All of the fixtures will have their `done()` method called.

For compatibility with [`sinon`](http://sinonjs.org), if there is no `done()`
method on a fixture but there is a `restore()` method, that will be called
instead.

The promise will resolve to one of the following:

1. The rejection of the lifted function, if it exists
2. The first rejection while tearing down a fixture, if any
3. The value returned by the lifted function.
