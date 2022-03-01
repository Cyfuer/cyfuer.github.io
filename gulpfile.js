'use strict';

const gulp = require('gulp')
const { build } = require('./gulp/tasks/build.js')
const { bundle } = require('./gulp/tasks/bundle.js')
const { serve } = require('./gulp/tasks/serve.js')


exports.build = function (cb) {
    build(cb);
}

exports.bundle = function (cb) {
    bundle(cb);
}

exports.serve = function (cb) {
    serve(cb);
}

