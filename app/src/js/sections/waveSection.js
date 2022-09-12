'use strict';

var Section = require('../classes/SectionClass');

var TextPanel = require('../objects3D/TextPanelObject3D');
var Wave = require('../objects3D/WaveObject3D');

var waveSection = new Section('wave');

var waveCache = { y: 0 };
var wave = new Wave();
waveSection.add(wave.el);

// var textCh = new TextPanel(
//   '爱 好',
//   {
//     font: 'Arial',
//     align: 'center',
//     style: '',
//     size: 50,
//     lineSpacing: 40
//   }
// );
// textCh.el.position.set(-11, 10, 0);
// textCh.el.rotation.set(-0.4, -0.6, 0.04);
// waveSection.add(textCh.el);

// var textEn = new TextPanel(
//   'INTEREST IN PAINTING',
//   {
//     align: 'center',
//     style: '',
//     size: 16,
//     lineSpacing: 40
//   }
// );
// textEn.el.position.set(-10, 7.6, 0);
// textEn.el.rotation.set(-0.4, -0.6, 0.04);
// waveSection.add(textEn.el);

wave.el.visible = false;

waveSection.onIn(function(way) {
    // textCh.in();
    // textEn.in();
    wave.in(way);
});

waveSection.onOut(function(way) {
    // textCh.out(way);
    // textEn.out(way);
    wave.out(way);
});

waveSection.onStart(function() {
    wave.start();

    wave.el.visible = true;
});

waveSection.onStop(function() {
    wave.stop();

    wave.el.visible = false;
});

waveSection.onRetract(function() {
    waveCache.y = wave.el.position.y;
    TweenLite.to(wave.el.position, 1.5, { y: -29 });
    // TweenLite.to(textCh.el.rotation, 1.5, {x: -0.2, y: -0.2, z: 0});
    // TweenLite.to(textEn.el.rotation, 1.5, {x: -0.2, y: -0.2, z: 0});

    // TweenLite.to(textCh.el.position, 1.5, {x: -11, y: 19, z: -20});
    // TweenLite.to(textEn.el.position, 1.5, {x: -10, y: 17, z: -20});
});

waveSection.onTract(function() {
    TweenLite.to(wave.el.position, 1.5, { y: waveCache.y });
    // TweenLite.to(textCh.el.rotation, 1.5, {x: -0.4, y: -0.6, z: 0.04});
    // TweenLite.to(textEn.el.rotation, 1.5, {x: -0.4, y: -0.6, z: 0.04});

    // TweenLite.to(textCh.el.position, 1.5, {x: -11, y: 10, z: 0});
    // TweenLite.to(textEn.el.position, 1.5, {x: -10, y: 7.6, z: 0});
});

module.exports = waveSection;