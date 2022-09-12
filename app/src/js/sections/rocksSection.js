'use strict';

var Section = require('../classes/SectionClass');

var TextPanel = require('../objects3D/TextPanelObject3D');
var Rocks = require('../objects3D/RocksObject3D');

var rocksSection = new Section('rocks');

var rocks = new Rocks();
rocksSection.add(rocks.el);

// var textCh = new TextPanel(
//   '留 言',
//   {
//     font: 'Arial',
//     align: 'center',
//     style: '',
//     size: 50,
//     lineSpacing: 40
//   }
// );
// textCh.el.position.set(-17, 2.4, -30);
// textCh.el.rotation.set(0, 0, 0.08);
// rocksSection.add(textCh.el);
// textCh.out('down');

// var textEn = new TextPanel(
//   'MESSAGE BOARD',
//   {
//     align: 'center',
//     style: '',
//     size: 16,
//     lineSpacing: 40
//   }
// );
// textEn.el.position.set(-17, 0, -30);
// textEn.el.rotation.set(0, 0, 0.08);
// rocksSection.add(textEn.el);
// textEn.out('down');

rocks.el.visible = false;

rocksSection.onIn(function() {
    // textCh.in();
    // textEn.in();
    rocks.in();
});

rocksSection.onOut(function(way) {
    // text.out('down');
    // textCh.out(way);
    // textEn.out(way);
    rocks.out(way);
});

rocksSection.onStart(function() {
    rocks.start();
});

rocksSection.onStop(function() {
    rocks.stop();
});

rocksSection.show = function() {
    rocks.el.visible = true;
};

rocksSection.hide = function() {
    rocks.el.visible = false;
};

rocksSection.onRetract(function() {
    TweenLite.to(rocks.el.position, 1.5, { x: 0, y: 30, z: -60 });


    // TweenLite.to(textCh.el.position, 1.5, {x: -17, y: 7, z: -20});
    // TweenLite.to(textEn.el.position, 1.5, {x: -16, y: 4, z: -20});
});

rocksSection.onTract(function() {
    TweenLite.to(rocks.el.position, 1.5, { x: 0, y: 0, z: 0 });

    // TweenLite.to(textCh.el.position, 1.5, {x: -17, y: 2.4, z: -30});
    // TweenLite.to(textEn.el.position, 1.5, {x: -17, y: 0, z: -30});
});

module.exports = rocksSection;