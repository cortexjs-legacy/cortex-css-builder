var async = require('async');

module.exports = Walker;

function Walker(traveller) {
  this.traveller = traveller;
  this.css_modules = {};
}

Walker.prototype.walk = function (tree, callback, _level) {

  traveller = this.traveller;
  _level = _level || 0;
  var css_modules = this.css_modules;
  var name = tree.from.split("@")[0];
  var version = tree.version;
  var self = this;

  function cb(err) {
    if (err) {
      return callback(err);
    }
    callback(null, self.css_modules);
  }

  traveller.resolvePackage(name, version, function (err, pkg) {
    if (err) {
      return done(err);
    }

    // update css modules
    if (!pkg.css) {
      pkg.css = [];
    }

    if (pkg.css.length) {
      css_modules[name] = css_modules[name] || {};
      var module = css_modules[name][version];
      if (module) {
        if (module.level < _level) {
          module.level = _level;
        }
      } else {
        module = {
          css: pkg.css,
          level: _level
        }
      }
      css_modules[name][version] = module;
      this.css_modules = css_modules;
    }

    // dig deeper
    if (tree.dependencies) {
      async.map(Object.keys(tree.dependencies), function (name, done) {
        sub_tree = tree.dependencies[name];
        self.walk(sub_tree, done, _level + 1);
      }, function (err) {
        if (err) {
          return cb(err);
        }
        cb(null, self.css_modules);
      });
    } else {
      cb(null);
    }
  });
}