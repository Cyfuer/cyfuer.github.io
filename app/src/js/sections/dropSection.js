'use strict';

var Section = require('../classes/SectionClass');

var TextPanel = require('../objects3D/TextPanelObject3D');
var Drop = require('../objects3D/DropObject3D');

var dropSection = new Section('drop');

var drop = new Drop({ amplitude: 4 });
drop.el.rotation.x = -0.3;
drop.el.position.y = -10;
dropSection.add(drop.el);

var textCh = new TextPanel(
  '区 块 链',
  {
    font: 'Arial',
    align: 'left',
    style: '',
    size: 50,
    lineSpacing: 40
  }
);
textCh.el.position.set(-5.2, -5.6, -4);
textCh.el.rotation.set(0, 0, 0.1);
dropSection.add(textCh.el);

var textEn = new TextPanel(
  'BLOCKCHAIN TECHNOLOGY',
  {
    align: 'left',
    style: '',
    size: 16,
    lineSpacing: 40
  }
);
textEn.el.position.set(-6, -7.8, -4);
textEn.el.rotation.set(0, 0, 0.1);
dropSection.add(textEn.el);

drop.el.visible = false;

dropSection.onIn(function () {
  drop.in();
  textCh.in();
  textEn.in();
});

dropSection.onOut(function (way) {
  drop.out(way);
  textCh.out(way);
  textEn.out(way);
});

dropSection.onStart(function () {
  drop.start();

  drop.el.visible = true;
});

dropSection.onStop(function () {
  drop.stop();

  drop.el.visible = false;
});

dropSection.onRetract(function () {
  TweenLite.to(textCh.el.rotation, 1.5, {z: 0});
  TweenLite.to(textEn.el.rotation, 1.5, {z: 0});

  TweenLite.to(textCh.el.position, 1.5, {x: -5.2, y: -7, z: -4});
  TweenLite.to(textEn.el.position, 1.5, {x: -6, y: -9, z: -4});
});

dropSection.onTract(function () {
  TweenLite.to(textCh.el.rotation, 1.5, {z: 0.1});
  TweenLite.to(textEn.el.rotation, 1.5, {z: 0.1});

  TweenLite.to(textCh.el.position, 1.5, {x: -5.2, y: -5.6, z: -4});
  TweenLite.to(textEn.el.position, 1.5, {x: -6, y: -7.8, z: -4});
});

module.exports = dropSection;