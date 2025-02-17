'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var notify = require('gulp-notify');
var watchify = require('watchify');
var browserify = require('browserify');
var uglify = require('gulp-uglify');

var pkg = require('../utils/pkg');
var splitPath = require('../utils/splitPath');

function scripts (entry, output, message) {
  message = message || 'Scripts';

  var outputDetails = splitPath(output);

  var bundler = pkg.watch
    ? watchify(browserify(entry, { debug: pkg.debug }))
    : browserify({ entries: [entry] })

  bundler.on('update', bundle);

  function bundle() {
    return bundler.bundle()
      .on('error', function (error) {
        gutil.log('Browserify error', error);
        gutil.beep();
        notify({ title: message, message: 'Error', sound: 'Basso' });
        this.end();
      })
      .pipe(source(outputDetails.file))
      .pipe(pkg.debug || false ? gutil.noop() : buffer())
      .pipe(pkg.debug || false ? gutil.noop() : uglify())
      .pipe(gulp.dest(outputDetails.path))
      .pipe(notify({ title: message, message: 'Success', sound: 'Morse' }));
  }

  return bundle();
}

const scripts3D = function (cb) {
  scripts(
    './app/src/js/main3D.js',
    './app/dist/js/3D/main.js',
    'Scripts 3D'
  );
  cb();
}

const scripts2D = function (cb) {
  scripts(
    './app/src/js/main2D.js',
    './app/dist/js/2D/main.js',
    'Scripts 2D'
  );
  cb();
}

exports.scripts3D = scripts3D;
exports.scripts2D = scripts2D;
exports.scripts = gulp.series(scripts2D, scripts3D);
