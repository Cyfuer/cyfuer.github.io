'use strict';

var Section = require('../classes/SectionClass');

var TextPanel = require('../objects3D/TextPanelObject3D');
var Ball = require('../objects3D/BallObject3D');
var Grid = require('../objects3D/GridObject3D');

var ballSection = new Section('ball');

var ball = new Ball();
ball.el.rotation.z = 2;
ballSection.add(ball.el);

var grid = new Grid({
    step: 5,
    stepsX: 11,
    stepsY: 11,
    loop: true
});
grid.el.rotation.set(1.5, 1, 2);
grid.el.position.x = -20;
ballSection.add(grid.el);

// var textCh = new TextPanel(
//   '阅 读',
//   {
//     font: 'Arial',
//     align: 'right',
//     style: '',
//     size: 50,
//     lineSpacing: 40
//   }
// );
// textCh.el.position.set(15, 0, 15);
// textCh.el.rotation.set(0, -0.4, 0);
// ballSection.add(textCh.el);

// var textEn = new TextPanel(
//   'READING MATTER',
//   {
//     align: 'right',
//     style: '',
//     size: 16,
//     lineSpacing: 40
//   }
// );
// textEn.el.position.set(24, -2.6, 0);
// textEn.el.rotation.set(0, -0.4, 0);
// ballSection.add(textEn.el);

ball.el.visible = false;
grid.el.visible = false;

ballSection.onIn(function() {
    ball.in();
    grid.in();
    // textCh.in();
    // textEn.in();
});

ballSection.onOut(function(way) {
    grid.out(way);
    // textCh.out(way);
    // textEn.out(way);

    if (way === 'up') {
        ball.out();
    }
});

ballSection.onStart(function() {
    ball.start();
    grid.start();

    ball.el.visible = true;
    grid.el.visible = true;
});

ballSection.onStop(function() {
    ball.stop();
    grid.stop();

    ball.el.visible = false;
    grid.el.visible = false;
});

ballSection.onRetract(function() {

    TweenLite.to(ball.el.scale, 1.5, { x: 0.6, y: 0.6, z: 0.6 });
    // TweenLite.to(textCh.el.position, 1.5, {x: 10, y: -2, z: 15});
    // TweenLite.to(textEn.el.position, 1.5, {x: 20, y: 1, z: 0});

});

ballSection.onTract(function() {
    TweenLite.to(ball.el.scale, 1.5, { x: 1, y: 1, z: 1 });
    // TweenLite.to(textCh.el.position, 1.5, {x: 15, y: 0, z: 15});
    // TweenLite.to(textEn.el.position, 1.5, {x: 24, y: -2.6, z: 0});
});

module.exports = ballSection;