'use strict';

const ng = require('../helpers/ng');
const tmp = require('../helpers/tmp');

const existsSync = require('exists-sync');
const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const root = process.cwd();

const testPath = path.join(root, 'tmp', 'foo', 'src', 'app');

function fileExpectations(expectation) {
  const dir = 'my-route';
  expect(existsSync(path.join(testPath, dir, 'my-route.component.ts'))).to.equal(expectation);
}

xdescribe('Acceptance: ng generate route', function () {
  beforeEach(function () {
    return tmp.setup('./tmp').then(function () {
      process.chdir('./tmp');
    }).then(function () {
      return ng(['new', 'foo', '--skip-install']);
    });
  });

  afterEach(function () {
    this.timeout(10000);

    return tmp.teardown('./tmp');
  });

  it('ng generate route my-route', function () {
    return ng(['generate', 'route', 'my-route']).then(() => {
      fileExpectations(true, true);
    });
  });

  it('ng generate route +my-route', function () {
    return ng(['generate', 'route', '+my-route']).then(() => {
      fileExpectations(true, true);
    });
  });

  it('ng generate route +my-route/my-other', () => {
    return ng(['generate', 'route', '+my-route'])
      .then(() => ng(['generate', 'route', '+my-route/my-other', '--default']))
      .then(() => ng(['generate', 'route', '+my-route/+my-other/my-third', '--default']))
      .then(() => {
        expect(existsSync(path.join(testPath, '+my-route/my-route.component.ts')))
          .to.equal(true);
        expect(existsSync(path.join(testPath, '+my-route/+my-other/my-other.component.ts')))
          .to.equal(true);
        expect(existsSync(path.join(testPath, '+my-route/+my-other/+my-third/my-third.component.ts')))
          .to.equal(true);

        const appContent = fs.readFileSync(path.join(testPath, 'foo.component.ts'), 'utf-8');
        const myRouteContent = fs.readFileSync(path.join(testPath, '+my-route/my-route.component.ts'), 'utf-8');
        const myOtherRouteContent = fs.readFileSync(path.join(testPath, '+my-route/+my-other/my-other.component.ts'), 'utf-8');
        const myThirdRouteContent = fs.readFileSync(path.join(testPath, '+my-route/+my-other/+my-third/my-third.component.ts'), 'utf-8');

        expect(appContent).to.match(/@Routes\(\[[\s\S]+\/\+my-route\/\.\.\.[\s\S]+\]\)/m);
        expect(myRouteContent).to.match(/@Routes\(\[[\s\S]+\/my-other\/\.\.\.[\s\S]+\]\)/m);
        expect(myOtherRouteContent).to.match(/@Routes\(\[[\s\S]+\/my-third[^\.][\s\S]+\]\)/m);
        expect(myThirdRouteContent).to.not.include('@Routes');
      });
  });

  it('ng generate route details --path /details/:id', () => {
    return ng(['generate', 'route', 'details', '--path', '/details/:id'])
      .then(() => {
        const appContent = fs.readFileSync(path.join(testPath, 'foo.component.ts'), 'utf-8');
        expect(appContent).to.match(/path: '\/details\/:id'/m);
      });
  });

  it('ng generate route my-route --dry-run does not modify files', () => {
    var parentComponentPath = path.join(testPath, 'foo.component.ts');
    var parentComponentHtmlPath = path.join(testPath, 'foo.component.html')

    var unmodifiedParentComponent = fs.readFileSync(parentComponentPath, 'utf8');
    var unmodifiedParentComponentHtml = fs.readFileSync(parentComponentHtmlPath, 'utf8');

    return ng(['generate', 'route', 'my-route', '--dry-run']).then(() => {
      var afterGenerateParentComponent = fs.readFileSync(parentComponentPath, 'utf8');
      var afterGenerateParentHtml = fs.readFileSync(parentComponentHtmlPath, 'utf8');

      expect(afterGenerateParentComponent).to.equal(unmodifiedParentComponent);
      expect(afterGenerateParentHtml).to.equal(unmodifiedParentComponentHtml);
    });
  });
});
