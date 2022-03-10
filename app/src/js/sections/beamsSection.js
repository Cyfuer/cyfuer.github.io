'use strict';

var TweenLite = require('tweenlite');
var Section = require('../classes/SectionClass');
var TextPanel = require('../objects3D/TextPanelObject3D');
var Beam = require('../objects3D/BeamObject3D');

var beamsSection = new Section('beams');

var leftBeam = new Beam({ color: '#808080', delay: 0.25 });
var leftBeamX = 15;
leftBeam.el.position.set(leftBeamX, 25, -10);
leftBeam.initialX = leftBeamX;
beamsSection.add(leftBeam.el);

var middleBeam = new Beam({ color: '#ffffff', width: 4, cubeSize: 1, delay: 0.1 });
var middleBeamX = 0;
middleBeam.el.position.y = 15;
middleBeam.initialX = middleBeamX;
beamsSection.add(middleBeam.el);

var rightBeam = new Beam({ color: '#4c4c4c', delay: 0.3 });
var rightBeamX = -20;
rightBeam.el.position.set(-20, 30, -20);
rightBeam.initialX = rightBeamX;
beamsSection.add(rightBeam.el);

var textCh = new TextPanel(
  '博 客\n',
  {
    font: 'Arial',
    align: 'right',
    style: '',
    size: 50,
    lineSpacing: 40
  }
);
textCh.el.position.set(3, 8, 0);
textCh.el.rotation.set(0, 0.3, 0);
beamsSection.add(textCh.el);

var textEn = new TextPanel(
  'BLOG ARCHICH FROM NOTION\n',
  {
    align: 'right',
    style: '',
    size: 16,
    lineSpacing: 40
  }
);
textEn.el.position.set(6.1, 6.4, 0);
textEn.el.rotation.set(0, 0.4, 0);
beamsSection.add(textEn.el);

leftBeam.el.visible = false;
middleBeam.el.visible = false;
rightBeam.el.visible = false;

beamsSection.onIn(function () {
  leftBeam.in();
  middleBeam.in();
  rightBeam.in();
  textCh.in();
  textEn.in();
});

beamsSection.onOut(function (way) {
  leftBeam.out(way);
  middleBeam.out(way);
  rightBeam.out(way);
  textCh.out(way);
  textEn.out(way);
});

beamsSection.onStart(function () {
  leftBeam.start();
  middleBeam.start();
  rightBeam.start();

  leftBeam.el.visible = true;
  middleBeam.el.visible = true;
  rightBeam.el.visible = true;
});

beamsSection.onStop(function () {
  leftBeam.stop();
  middleBeam.stop();
  rightBeam.stop();

  leftBeam.el.visible = false;
  middleBeam.el.visible = false;
  rightBeam.el.visible = false;
});

beamsSection.onRetract(function () {
  TweenLite.to(textCh.el.rotation, 1.5, {y: 0});
  TweenLite.to(textEn.el.rotation, 1.5, {y: 0});
});

beamsSection.onTract(function () {
  TweenLite.to(textCh.el.rotation, 1.5, {y: 0.4});
  TweenLite.to(textEn.el.rotation, 1.5, {y: 0.4});
});

module.exports = beamsSection;