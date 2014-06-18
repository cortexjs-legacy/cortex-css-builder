'use strict';

var expect = require('chai').expect;
var builder = require('../');
var playground = require('cortex-playground');
var cached_resources = playground.cached_resources();
var path = require('path');
var mkdirp = require('mkdirp');
var fse = require('fs-extra');

describe('get css dependencies', function () {
  var fixture_dir = path.join(__dirname, 'fixtures');
  var cache_root = path.join(fixture_dir, 'cache_root');

  this.timeout(0);
  beforeEach(function (done) {
    cached_resources.copy(cache_root, function (err) {
      if (err) {
        return done(err);
      }
      var test_package_path = path.join(fixture_dir, 'cortex.json');
      var test_package = require(test_package_path);
      var dest_package_dir = path.join(cache_root, test_package.name, test_package.version, 'package');
      var dest_package_path = path.join(dest_package_dir, 'cortex.json');

      mkdirp(dest_package_dir, function (err) {
        if (err) {
          return done(err);
        }
        fse.copy(test_package_path, dest_package_path, done);
      });
    });
  });

  it('get', function (done) {
    builder.get({
      cwd: path.join(__dirname, 'fixtures'),
      cache_root: cache_root
    }, function (err, result) {
      console.log(result);
      expect(result).to.deep.equal();
    });
  });
});