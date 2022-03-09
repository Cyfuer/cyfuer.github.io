'use strict';

var THREE = require('three');

/**
 * Section class
 * 
 * @class Section
 * @constructor
 * @param {String} [name]
 * @requires THREE
 */
function Section (name) {
  this.name = name;
  this.playing = false;
  this.retracted = false;

  var fn = function () {};
  this._in = fn;
  this._out = fn;
  this._start = fn;
  this._stop = fn;
  this._retract = fn;
  this._tract = fn;

  this.el = new THREE.Object3D();
}

/**
 * Add a new object
 *
 * @method add
 * @param {THREE.Object3D} [object]
 */
Section.prototype.add = function (object) {
  this.el.add(object);
};

/**
 * Section's in animation
 *
 * @method in
 * @param {String} [way]
 */
Section.prototype.in = function (way) {
  this._in(way);
};

/**
 * Section's out animation
 *
 * @method out
 * @param {String} [way]
 */
Section.prototype.out = function (way) {
  this._out(way);
};

/**
 * Start the section
 *
 * @method start
 */
Section.prototype.start = function () {
  if (this.playing) {
    return false;
  }

  this._start();

  this.playing = true;
};

/**
 * Stop the section
 *
 * @method stop
 */
Section.prototype.stop = function () {
  if (!this.playing) {
    return false;
  }

  this._stop();

  this.playing = false;
};




/**
 * Retract the section
 *
 * @method retract
 */
 Section.prototype.retract = function () {
  if (this.retracted) {
    return false;
  }

  this._retract();

  this.retracted = true;
};

/**
 * Tract the section
 *
 * @method tract
 */
Section.prototype.tract = function () {
  if (!this.retracted) {
    return false;
  }

  this._tract();

  this.retracted = false;
};



/**
 * Pass the in handler
 *
 * @method onIn
 * @param {Function} [callback]
 */
Section.prototype.onIn = function (callback) {
  this._in = callback;
};

/**
 * Pass the out handler
 *
 * @method onOut
 * @param {Function} [callback]
 */
Section.prototype.onOut = function (callback) {
  this._out = callback;
};

/**
 * Pass the start handler
 *
 * @method onStart
 * @param {Function} [callback]
 */
Section.prototype.onStart = function (callback) {
  this._start = callback;
};

/**
 * Pass the stop handler
 *
 * @method onStop
 * @param {Function} [callback]
 */
Section.prototype.onStop = function (callback) {
  this._stop = callback;
};

/**
 * Pass the retract handler
 *
 * @method onRetract
 * @param {Function} [callback]
 */
 Section.prototype.onRetract = function (callback) {
  this._retract = callback;
};

/**
 * Pass the stop handler
 *
 * @method onTract
 * @param {Function} [callback]
 */
Section.prototype.onTract = function (callback) {
  this._tract = callback;
};

module.exports = Section;