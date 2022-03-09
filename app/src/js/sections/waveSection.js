'use strict';

var Section = require('../classes/SectionClass');

var TextPanel = require('../objects3D/TextPanelObject3D');
var Wave = require('../objects3D/WaveObject3D');

var waveSection = new Section('wave');

var wave = new Wave();
waveSection.add(wave.el);

var textCh = new TextPanel(
  '爱 好',
  {
    font: 'Arial',
    align: 'center',
    style: '',
    size: 50,
    lineSpacing: 40
  }
);
textCh.el.position.set(-11, 10, 0);
textCh.el.rotation.set(-0.4, -0.6, 0.04);
waveSection.add(textCh.el);

var textEn = new TextPanel(
  'INTEREST IN PAINTING',
  {
    align: 'center',
    style: '',
    size: 16,
    lineSpacing: 40
  }
);
textEn.el.position.set(-10, 7.6, 0);
textEn.el.rotation.set(-0.4, -0.6, 0.04);
waveSection.add(textEn.el);

wave.el.visible = false;

waveSection.onIn(function (way) {
  textCh.in();
  textEn.in();
  wave.in(way);
});

waveSection.onOut(function (way) {
  textCh.out(way);
  textEn.out(way);
  wave.out(way);
});

waveSection.onStart(function () {
  wave.start();

  wave.el.visible = true;
});

waveSection.onStop(function () {
  wave.stop();

  wave.el.visible = false;
});

module.exports = waveSection;