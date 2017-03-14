'use strict';

const ng = require('../helpers/ng');
const tmp = require('../helpers/tmp');
const SilentError = require('silent-error');
const expect = require('chai').expect;

describe('Acceptance: ng destroy', function () {
  beforeEach(function () {
    this.timeout(10000);
    return tmp.setup('./tmp').then(function () {
      process.chdir('./tmp');
    }).then(function () {
      return ng(['new', 'foo', '--skip-install']);
    });
  });

  afterEach(function () {
    return tmp.teardown('./tmp');
  });

  it('without args should fail', function () {
    return ng(['destroy']).then(() => {
      throw new SilentError('ng destroy should fail.');
    }, (err) => {
      expect(err.message).to.equal('The destroy command is not supported by Angular CLI.');
    });
  });

  it('with args should fail', function () {
    return ng(['destroy', 'something']).then(() => {
      throw new SilentError('ng destroy something should fail.');
    }, (err) => {
      expect(err.message).to.equal('The destroy command is not supported by Angular CLI.');
    });
  });
});
