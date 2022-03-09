'use strict';

var THREE = require('three');

var Section = require('../classes/SectionClass');

var FlowField = require('../objects3D/FlowFieldObject3D');
var TextPanel = require('../objects3D/TextPanelObject3D');

var flowSection = new Section('flow');

var points = [
  new THREE.Vector3(0, 50, 20),
  new THREE.Vector3(20, 0, -10),
  new THREE.Vector3(-20, -50, 0)
];

var field = new FlowField(points, {
  subsAmplitude: 50,
  subsNumber: 10
});
flowSection.add(field.el);

var textCh = new TextPanel(
  '过 往 项 目',
  {
    font: 'Arial',
    align: 'right',
    style: '',
    size: 50,
    lineSpacing: 40
  }
);
textCh.el.position.set(0, 0, -10);
textCh.el.rotation.set(0, 0.4, 0);
flowSection.add(textCh.el);

var textEn = new TextPanel(
  'PAST PROJUCTS',
  {
    align: 'right',
    style: '',
    size: 16,
    lineSpacing: 40
  }
);
textEn.el.position.set(1.8, -2.4, -10);
textEn.el.rotation.set(0, 0.4, 0);
flowSection.add(textEn.el);


field.el.visible = false;

var fieldIn = false;

flowSection.fieldIn = function () {
  if (fieldIn) {
    return false;
  }

  fieldIn = true;

  field.in();
};

flowSection.onIn(function () {
  textCh.in();
  textEn.in();
});

flowSection.onOut(function (way) {
  textCh.out(way);
  textEn.out(way);
});

flowSection.onStart(function () {
  field.start();

  field.el.visible = true;
});

flowSection.onStop(function () {
  field.stop();

  field.el.visible = false;
});

module.exports = flowSection;