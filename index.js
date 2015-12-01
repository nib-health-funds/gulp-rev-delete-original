var through = require('through2');
var rimraf = require('rimraf');

/**
 * Return a stream for deleting the original file
 * @param   {Object}          options
 * @param   {RegExp|function} [options.exclude]
 * @returns {function}
 */
module.exports = function(options) {
  options = options || {};
  return through.obj(function (file, enc, cb) {

    //delete the original file
    var del = function() {
      rimraf(file.revOrigPath, function(err) {
        if (err) cb(err);
        cb(null, file);
      });
    };

    //don't delete files that haven't been rewritten
    if (file.revOrigPath === file.path) {
      return cb(null, file);
    }

    //exclude files from being deleted
    if (options.exclude) {

      var
        excluded,
        filter = options.exclude
      ;

      if (typeof(filter) === 'function') {
        excluded = filter(file);
      } else if(filter instanceof RegExp) {
        excluded = filter.test(file.path);
      }

      if (excluded) {
        return cb(null, file);
      } else {
        return del();
      }

    }

    //delete the original file
    return del();

  });
};