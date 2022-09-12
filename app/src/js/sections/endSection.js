'use strict';

var Section = require('../classes/SectionClass');

var TextPanel = require('../objects3D/TextPanelObject3D');
var LookAtField = require('../objects3D/LookAtFieldObject3D');

var endSection = new Section('end');

var textCh = new TextPanel(
    '谢 谢 观 看', {
        font: 'Arial',
        align: 'center',
        style: '',
        size: 50,
        lineSpacing: 40
    }
);
textCh.el.position.set(0, 0, 0);
textCh.el.rotation.set(0, 0, 0);
endSection.add(textCh.el);

var textEn = new TextPanel(
    'THANKS FOR WATCHING\n', {
        align: 'center',
        style: '',
        size: 16,
        lineSpacing: 40
    }
);
textEn.el.position.set(0, -3.8, 0);
textEn.el.rotation.set(0, 0, 0);
endSection.add(textEn.el);

var field = new LookAtField({
    count: 50
});
endSection.add(field.el);

endSection.onIn(function() {
    textCh.in();
    textEn.in();
    field.in();
});

endSection.onOut(function(way) {
    textCh.out(way);
    textEn.out(way);
    field.out(way);
});

endSection.onRetract(function() {
    TweenLite.to(textCh.el.position, 1.5, { x: 0, y: 5, z: -12 });
    TweenLite.to(textEn.el.position, 1.5, { x: 0, y: 0, z: -10 });
});

endSection.onTract(function() {
    TweenLite.to(textCh.el.position, 1.5, { x: 0, y: 0, z: 0 });
    TweenLite.to(textEn.el.position, 1.5, { x: 0, y: -3.8, z: 0 });
});

module.exports = endSection;