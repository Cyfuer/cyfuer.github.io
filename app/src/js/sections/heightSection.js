'use strict';

var Section = require('../classes/SectionClass');

var TextPanel = require('../objects3D/TextPanelObject3D');
var HeightMap = require('../objects3D/HeightMapObject3D');

var heightSection = new Section('height');

var heightMap = new HeightMap({
    horizontal: true,
    vertical: false,
    plane: false,
    points: false,
    maps: [
        { name: 'D', url: './app/public/img/heightMap-D.jpg' },
        { name: 'R', url: './app/public/img/heightMap-R.jpg' },
        { name: 'E', url: './app/public/img/heightMap-E.jpg' },
        { name: 'A', url: './app/public/img/heightMap-A.jpg' },
        { name: 'M', url: './app/public/img/heightMap-M.jpg' }
    ]
});
heightMap.el.position.z = -10;
heightMap.el.rotation.y = -0.6;
heightSection.add(heightMap.el);

// var textCh = new TextPanel(
//   '我 的 项 目',
//   {
//     font: 'Arial',
//     align: 'right',
//     style: '',
//     size: 50,
//     lineSpacing: 40
//   }
// );
// textCh.el.position.set(-20, 0, 0);
// textCh.el.rotation.set(0, 0, 0);
// heightSection.add(textCh.el);

// var textEn = new TextPanel(
//   'MY PROJECT',
//   {
//     align: 'right',
//     style: '',
//     size: 16,
//     lineSpacing: 40
//   }
// );
// textEn.el.position.set(-16.9, -2.2, 0);
// textEn.el.rotation.set(0, 0, 0);
// heightSection.add(textEn.el);

heightMap.el.visible = false;

heightSection.onIn(function() {
    // textCh.in();
    // textEn.in();
});

heightSection.onOut(function(way) {
    // textCh.out(way);
    // textEn.out(way);
});

heightSection.onStart(function() {
    if (!heightMap.ready) {
        return false;
    }

    heightMap.start();
});

heightSection.onStop(function() {
    if (!heightMap.ready) {
        return false;
    }

    heightMap.stop();
});

heightSection.show = function() {
    heightMap.el.visible = true;
};

heightSection.hide = function() {
    heightMap.el.visible = false;
};

heightSection.onRetract(function() {
    TweenLite.to(heightMap.el.position, 1.5, { x: 16, y: 8, z: -30 });
});

heightSection.onTract(function() {
    TweenLite.to(heightMap.el.position, 1.5, { x: 0, y: 0, z: -10 });
});

module.exports = heightSection;