"use strict";
const tap = require('tap');
const withFixture = require('./');

tap.test('withfixture resolves with a promise', t => {
  t.plan(2);
  return withFixture([], () => t.ok('called inside'))
    .then(() => t.pass("We have a promise"))
}); 

tap.test('withfixture calls its lifted function before the promise resolves', t => {
  t.plan(1);
  let called = false;
  return withFixture([], () => { called = true })
    .then(() => t.ok(called, 'lifted function was called'))
}); 

tap.test('withfixture shows the error from its lifted function in preference to its fixtures', t => {
  t.plan(1);
  return withFixture([{ done: () => { throw new Error("boom") } }], () => { throw new Error("bam") })
    .catch(e => t.equal(e.message, "bam", 'found error message from lifted'))
}); 

tap.test('withfixture shows the error from its lifted function in preference to its fixtures', t => {
  t.plan(1);
  return withFixture([{ done: () => { throw new Error("boom") } }], () => {})
    .catch(e => t.equal(e.message, "boom", 'found error message from fixture'))
}); 

tap.test('withfixture ends all its fixtures', t => {
  t.plan(2);
  return withFixture([
    { done: () => { t.pass("ended one") } },
    { done: () => { t.pass("ended two") } }
  ], () => {})
}); 

tap.test('withfixture ends all its fixtures even if there is an error', t => {
  t.plan(3);
  return withFixture([
    { done: () => { t.pass("ended one"); throw new Error("Boom") } },
    { done: () => { t.pass("ended two"); throw new Error("Bam") } }
  ], () => {})
    .catch(e => t.equal(e.message, "Boom", "error was propagated"))
}); 

tap.test('withfixture calls restore to end a fixture if done is not present', t => {
  t.plan(2);
  return withFixture([
    { done: () => { t.pass("ended one") } , restore: () => { t.fail("Called restore instead of done") } },
    { restore: () => { t.pass("ended two") } }
  ], () => {})
}); 
