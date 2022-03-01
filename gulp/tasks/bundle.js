'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var notify = require('gulp-notify');

var splitPath = require('../utils/splitPath');

function bundle (entries, output, title) {
  title = title || 'Bundle';

  var outputDetails = splitPath(output);

  return gulp.src(entries)
    .pipe(concat(outputDetails.file))
    .pipe(gulp.dest(outputDetails.path))
    .pipe(notify({ title: title, message: 'Success', sound: 'Morse' }));

}

const bundle3D = function (cb) {
  bundle(
    ['./app/dist/js/3D/vendor.js', './app/dist/js/3D/main.js'],
    './app/dist/js/3D/bundle.js',
    'Bundle 3D'
  );
  cb();
}

const bundle2D = function (cb) {
  bundle(
    ['./app/dist/js/2D/vendor.js', './app/dist/js/2D/main.js'],
    './app/dist/js/2D/bundle.js',
    'Bundle 2D'
  );
  cb();
}

exports.bundle3D = bundle3D;
exports.bundle2D = bundle2D;
exports.bundle = gulp.series(bundle3D, bundle2D);