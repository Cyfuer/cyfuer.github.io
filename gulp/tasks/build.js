'use strict';

const gulp = require('gulp');
const { html } = require('./html');
const { vendor, vendor3D, vendor2D } = require('./vendor');
const { scripts, scripts3D, scripts2D } = require('./scripts');
const { styles, styles3D, styles2D } = require('./styles');

exports.build = gulp.series(html, vendor, scripts, styles);
exports.build3D = gulp.series(html, vendor3D, scripts3D, styles3D);
exports.build2D = gulp.series(html, vendor2D, scripts2D, styles2D);