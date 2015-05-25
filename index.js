var through = require('through2');
var rimraf = require('rimraf');

/**
 *
 * @param   {Object}          options
 * @param   {RegExp|function} options.exclude
 * @returns {function}
 */
module.exports = function(options) {
  options = options || {};
  return through.obj(function (file, enc, cb) {

    //delete the original file
    function del() {
      rimraf(file.revOrigPath, function(err) {
        if (err) callback(err);
        cb(null, file);
      });
    }

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

      if (!excluded) {
        del();
      }

    } else {
      del();
    }

  });
};